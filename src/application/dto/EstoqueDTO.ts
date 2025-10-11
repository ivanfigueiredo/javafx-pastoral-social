import { LocalizacaoDTO } from "./LocalizacaoDTO";
import { UnidadeDeMedidadDTO } from "./UnidadeDeMedidaDTO";

export class EstoqueDTO {
    constructor(
        readonly idEstoque: number | null, 
        readonly validade: Date,
        readonly valorMedida: number,
        readonly entrada: Date,
        readonly saida: Date | null,
        readonly localizacao: LocalizacaoDTO,
        readonly unidadeDeMedida: UnidadeDeMedidadDTO
    ) {}
}
