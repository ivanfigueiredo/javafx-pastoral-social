import { ItemTemplateEntity } from "../../../adapters/persistence/entities/ItemTemplateEntity";
import { TemplateEntity } from "../../../adapters/persistence/entities/TemplateEntity";
import { TemplateTypeEnum } from "../../dto/enuns/TemplateTypeEnum";
import { TemplateItemDTO } from "../../dto/TemplateItemDTO";

export interface ItemTemplateRepository {
    save: (itemTemplate: ItemTemplateEntity) => Promise<ItemTemplateEntity>;
    existeTemplateByItens: (templateItens: TemplateItemDTO[], tipoTemplate: TemplateTypeEnum) => Promise<TemplateEntity | null>;
}