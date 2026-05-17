import { ItemTemplateEntity } from "../../adapters/persistence/entities/ItemTemplateEntity";
import { UnidadeMedidaEnum } from "../dto/enuns/UnidadeMedidaEnum";

export class ItemTemplateMapper {
    private constructor() {}

    public static formatPeso(itemTemplate: ItemTemplateEntity): string {
        switch (itemTemplate.itemProduto.unidadeMedida!.undMedidas) {
            case 'KG':
                return `${itemTemplate.quantidade}${itemTemplate.itemProduto.unidadeMedida!.undMedidas}`;
            case 'L':
                return `${itemTemplate.quantidade}${UnidadeMedidaEnum.L}`;
            case 'G':
                return (this.calcularQuantidade(itemTemplate) >= 1) ? `${this.calcularQuantidade(itemTemplate)}${UnidadeMedidaEnum.KG}` 
                    : `${itemTemplate.quantidade}${UnidadeMedidaEnum.G}`;
            case 'ML':
                return (this.calcularQuantidade(itemTemplate) >= 1) ? `${this.calcularQuantidade(itemTemplate)}${UnidadeMedidaEnum.L}` 
                    : `${itemTemplate.quantidade}${UnidadeMedidaEnum.ML}`;
            default:
                return `${itemTemplate.quantidade}${UnidadeMedidaEnum.UND}`;
        }
    }

    private static calcularQuantidade(itemTemplate: ItemTemplateEntity): number {
        const sum = itemTemplate.itemProduto.valorMedida! * itemTemplate.quantidade;
        const converteKG = (sum / 1000);
        return converteKG;
    }
}