export class CadastroAlimentoDTO {
    constructor(
        readonly validade: Date, 
        readonly itemProdutoId: number,
        readonly idLocalizacao: number,
        readonly idUnidadeMedida: number
    ) {}
}