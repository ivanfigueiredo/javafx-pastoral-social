import { ItemProdutoDTO } from "./ItemProdutoDTO";
import { LocalizacaoDTO } from "./LocalizacaoDTO";
import { UnidadeDeMedidadDTO } from "./UnidadeDeMedidaDTO";

export class EstoqueDTO {
    constructor(
        readonly idEstoque: number, 
        readonly validade: Date,
        readonly entrada: Date,
        readonly saida: Date | null,
        readonly itemProduto: ItemProdutoDTO,
        readonly localizacao: LocalizacaoDTO,
        readonly unidadeDeMedida: UnidadeDeMedidadDTO
    ) {}
}
