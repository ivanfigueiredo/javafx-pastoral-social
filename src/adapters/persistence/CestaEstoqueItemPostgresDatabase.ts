import { Logger } from "pino";
import { InternalServerErrorException } from "../../application/exceptions/InternalServerErrorException";
import { CestaEstoqueItemRepository } from "../../application/port/out/CestaEstoqueItemRepository";
import { CestaEstoqueItemEntity } from "./entities/CestaEstoqueItemEntity";
import { UnitOfWork } from "./unitOfWork/UnitOfWork";

export class CestaEstoqueItemPostgresDatabase implements CestaEstoqueItemRepository {
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly unitOfWork: UnitOfWork
    ) {
        this.logger = logger.child({ service: 'CestaEstoqueItemPostgresDatabase' })
    }

    public async save(cestaEstoqueItem: CestaEstoqueItemEntity): Promise<void> {
        try {
            await this.unitOfWork.transaction(CestaEstoqueItemEntity, cestaEstoqueItem);
        } catch (e: any) {
            this.logger.error({err: e.message}, "Erro ao persistir template")
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }
}