import { Logger } from "pino";
import { CestaGeradaRepository } from "../../application/port/out/CestaGeradaRepository";
import { CestaGeradaEntity } from "./entities/CestaGeradaEntity";
import { UnitOfWork } from "./unitOfWork/UnitOfWork";
import { InternalServerErrorException } from "../../application/exceptions/InternalServerErrorException";

export class CestaGeradaPostgresDatabase implements CestaGeradaRepository {
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly unitOfWork: UnitOfWork
    ) {
        this.logger = logger.child({service: "CestaGeradaPostgresDatabase"})
    }

    public async saveMany(cestas: CestaGeradaEntity[]): Promise<void> {
        try {
            await this.unitOfWork.transactionMany(CestaGeradaEntity, cestas);
        } catch (e: any) {
            this.logger.error({err: e.message}, "Erro ao salvar cestas");
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }
}