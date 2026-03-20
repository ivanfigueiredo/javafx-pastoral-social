import { UnidadeDeMedidadDTO } from "./UnidadeDeMedidaDTO";

export class EstoqueDTO {
    constructor(
        readonly idEstoque: number | null, 
        readonly validade: Date,
        readonly codProduto: string | null,
        readonly valorMedida: number,
        readonly entrada: Date,
        readonly saida: Date | null,
        readonly unidadeDeMedida: UnidadeDeMedidadDTO
    ) {}
}
