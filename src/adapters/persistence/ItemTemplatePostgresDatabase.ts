import { InternalServerErrorException } from "../../application/exceptions/InternalServerErrorException";
import { ItemTemplateRepository } from "../../application/port/out/ItemTemplateRepository";
import { ItemTemplateEntity } from "./entities/ItemTemplateEntity";
import { UnitOfWork } from "./unitOfWork/UnitOfWork";
import { Logger } from "pino";

export class ItemTemplatePostgresDatabase implements ItemTemplateRepository {
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly unitOfWork: UnitOfWork
    ) {
        this.logger = logger.child({service: "ItemTemplatePostgresDatabase"})
    }

    public async save(itemTemplate: ItemTemplateEntity): Promise<ItemTemplateEntity> {
        try {
           return await this.unitOfWork.transaction(ItemTemplateEntity, itemTemplate);
        } catch (e: any) {
            this.logger.error({err: e.message}, "Erro ao persistir itens template")
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }
    
}