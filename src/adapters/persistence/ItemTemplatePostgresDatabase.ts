import { Repository } from "typeorm";
import { ItemTemplateRepository } from "../../application/port/out/ItemTemplateRepository";
import { ItemTemplateEntity } from "./entities/ItemTemplateEntity";
import { Connection } from "./database/Connection";
import { UnitOfWork } from "./unitOfWork/UnitOfWork";

export class ItemTemplatePostgresDatabase implements ItemTemplateRepository {
    private readonly itemTemplateRepository: Repository<ItemTemplateEntity>;

    constructor(
        private readonly connection: Connection,
        private readonly unitOfWork: UnitOfWork
    ) {
        this.itemTemplateRepository = this.connection.getDataSourcer().getRepository(ItemTemplateEntity);
    }

    public async save(itemTemplate: ItemTemplateEntity): Promise<void> {
        await this.unitOfWork.transaction(ItemTemplateEntity, itemTemplate);
    }
    
}