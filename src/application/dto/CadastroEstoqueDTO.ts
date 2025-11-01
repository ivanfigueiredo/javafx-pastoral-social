export class CadastroEstoqueDTO {
    constructor(
        readonly validade: Date, 
        readonly itemProdutoId: number,
        readonly quantidade: number
    ) {}
}