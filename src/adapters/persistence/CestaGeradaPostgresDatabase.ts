import { Logger } from "pino";
import { CestaGeradaRepository } from "../../application/port/out/CestaGeradaRepository";
import { CestaGeradaEntity } from "./entities/CestaGeradaEntity";
import { UnitOfWork } from "./unitOfWork/UnitOfWork";
import { InternalServerErrorException } from "../../application/exceptions/InternalServerErrorException";
import { Connection } from "./database/Connection";
import { In, Repository } from "typeorm";

export class CestaGeradaPostgresDatabase implements CestaGeradaRepository {
    private readonly cestaRepository: Repository<CestaGeradaEntity>;
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private connection: Connection,
        private readonly unitOfWork: UnitOfWork
    ) {
        this.logger = logger.child({service: "CestaGeradaPostgresDatabase"});
        this.cestaRepository = connection.getDataSourcer().getRepository(CestaGeradaEntity);
    }

    public async saveMany(cestas: CestaGeradaEntity[]): Promise<void> {
        try {
            await this.unitOfWork.transactionMany(CestaGeradaEntity, cestas);
        } catch (e: any) {
            this.logger.error({err: e.message}, "Erro ao salvar cestas");
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }

    public async findCestaById(id: number): Promise<CestaGeradaEntity | null> {
        return this.cestaRepository.findOne({ where: { id } })
    }
}