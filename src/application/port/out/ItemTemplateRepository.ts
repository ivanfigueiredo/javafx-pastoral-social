import { ItemTemplateEntity } from "../../../adapters/persistence/entities/ItemTemplateEntity";

export interface ItemTemplateRepository {
    save: (itemTemplate: ItemTemplateEntity) => Promise<ItemTemplateEntity>;
}