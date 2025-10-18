import { CestaEstoqueItemEntity } from "../../../adapters/persistence/entities/CestaEstoqueItemEntity";

export interface CestaEstoqueItemRepository {
    save: (cestaEstoqueItem: CestaEstoqueItemEntity) => Promise<void>;
}