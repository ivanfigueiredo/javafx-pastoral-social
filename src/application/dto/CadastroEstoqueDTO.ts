export class CadastroEstoqueDTO {
    constructor(
        readonly validade: Date, 
        readonly itemProdutoId: number,
        readonly valorMedida: number,
        readonly idLocalizacao: number,
        readonly idUnidadeMedida: number
    ) {}
}