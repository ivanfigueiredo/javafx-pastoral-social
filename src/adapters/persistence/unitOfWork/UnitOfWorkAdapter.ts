import { DeepPartial, EntityTarget, FindOptionsWhere, ObjectLiteral, QueryRunner, SelectQueryBuilder } from 'typeorm'
import { UnitOfWorkPort } from '../../../application/port/out/UnitOfWorkPort';
import { Connection } from '../database/Connection';
import { UnitOfWork } from './UnitOfWork';
import { InternalServerErrorException } from '../../../application/exceptions/InternalServerErrorException';
import { Logger } from 'pino';


export class UnitOfWorkAdapter implements UnitOfWork, UnitOfWorkPort {
  private queryRunner: QueryRunner | null = null;
  private readonly logger: Logger;

  public constructor(
    logger: Logger,
    private readonly connection: Connection
  ) {
    this.logger = logger.child({service: "UnitOfWork"});
  }

  public async startTransaction(): Promise<void> {
    try {
      this.queryRunner = this.connection.getDataSourcer().createQueryRunner();
      this.queryRunner.connect();
      await this.queryRunner.startTransaction();
    } catch (error: any) {
      this.logger.error({err: error.message}, "Erro ao iniciar uma transacao");
      throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
    }
  }

  public async transaction<T extends ObjectLiteral>(entityTarget: EntityTarget<T>, data: DeepPartial<T>): Promise<T> {
    return await this.queryRunner!.manager.save(entityTarget, data);
  }

  public async transactionMany<T extends ObjectLiteral>(entityTarget: EntityTarget<T>, data: DeepPartial<T>[]): Promise<void> {
    await this.queryRunner!.manager.save(entityTarget, data);
  }

  public async delete<T extends ObjectLiteral>(entityTarget: EntityTarget<T>, criteria: { [key: string]: number }): Promise<void> {
    await this.queryRunner!.manager.delete<T>(entityTarget, criteria)
  }

  public async commit(): Promise<void> {
    try {
      await this.queryRunner!.commitTransaction()
    } catch (error: any) {
      this.logger.error({err: error.message}, "Erro ao commitar uma transacao");
      throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
    }
  }

  public async rollBack(): Promise<void> {
    await this.queryRunner!.rollbackTransaction()
  }

  public async release(): Promise<void> {
    await this.queryRunner!.release()
  }

  public async findOne<T extends ObjectLiteral>(entity: EntityTarget<T>, criteria: FindOptionsWhere<T>): Promise<T | null> {
    return this.queryRunner!.manager.findOne(entity, { where: criteria })
  }

  public async queryMany<T extends ObjectLiteral, R extends ObjectLiteral>(
    entity: EntityTarget<T>,
    alias: string,
    queryFn: (qb: SelectQueryBuilder<T>) => SelectQueryBuilder<R>
  ): Promise<R[]> {
    const qb = this.queryRunner!.manager.createQueryBuilder(entity, alias);
    const finalQb = queryFn(qb);
    return finalQb.getMany() as Promise<R[]>;
  }

  public async queryRawMany<T extends ObjectLiteral, R extends ObjectLiteral>(
    entity: EntityTarget<T>,
    alias: string,
    queryFn: (qb: SelectQueryBuilder<T>) => SelectQueryBuilder<R>
  ): Promise<R[]> {
    const qb = this.queryRunner!.manager.createQueryBuilder(entity, alias);
    const finalQb = queryFn(qb);
    return finalQb.getRawMany() as Promise<R[]>;
  }

  public async find<T extends ObjectLiteral>(entityTarget: EntityTarget<T>): Promise<T[]> {
    return await this.queryRunner!.manager.find(entityTarget);
  }
}
