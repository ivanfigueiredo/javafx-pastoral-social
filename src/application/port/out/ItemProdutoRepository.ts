import { ItemProdutoEntity } from "../../../adapters/persistence/entities/ItemProdutoEntity";

export interface ItemProdutoRepository {
    getProdutos: () => Promise<ItemProdutoEntity[]>
}