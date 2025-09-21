import { DeepPartial, EntityTarget, FindOptionsWhere, ObjectLiteral, SelectQueryBuilder } from "typeorm";

export interface UnitOfWork {
  transaction<T extends ObjectLiteral>(entityTarget: EntityTarget<T> , data: DeepPartial<T>): Promise<T>;
  transactionMany<T extends ObjectLiteral>(entityTarget: EntityTarget<T> , data: DeepPartial<T>[]): Promise<void>;
  findOne<T extends ObjectLiteral>(entity: EntityTarget<T>, criteria: FindOptionsWhere<T>): Promise<T | null>;
  find<T extends ObjectLiteral>(entityTarget: EntityTarget<T>): Promise<T[]>;
  delete<T extends ObjectLiteral>(entityTarget: EntityTarget<T>, criteria: { [key: string]: number }): Promise<void>;
  queryMany<T extends ObjectLiteral, R extends ObjectLiteral>(
    entity: EntityTarget<T>,
    alias: string,
    queryFn: (qb: SelectQueryBuilder<T>) => SelectQueryBuilder<R>
  ): Promise<R[]>;
  queryRawMany<T extends ObjectLiteral, R extends ObjectLiteral>(
    entity: EntityTarget<T>,
    alias: string,
    queryFn: (qb: SelectQueryBuilder<T>) => SelectQueryBuilder<R>
  ): Promise<R[]>;
}
