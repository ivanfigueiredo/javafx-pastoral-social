import { EstoqueDTO } from "./EstoqueDTO";

export class ItemProdutoDTO {
    constructor(readonly idItemProduto: number, readonly descricao: string, readonly quantidadeEstoque: number) {}
}