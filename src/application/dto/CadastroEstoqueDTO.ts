import { BadRequestException } from "../exceptions/BadRequestException";

export class CadastroEstoqueDTO {
    constructor(
        readonly validade: Date, 
        readonly itemProdutoId: number,
        readonly codProduto: string
    ) {
        if (validade === null || validade === undefined) {
            throw new BadRequestException("O campo validade é obrigatório.");
        }
        if (itemProdutoId === null || itemProdutoId === undefined) {
            throw new BadRequestException("O campo itemProdutoId é obrigatório.");
        }
        if (codProduto === null || codProduto === undefined) {
            throw new BadRequestException("O campo codProduto é obrigatório.");
        }
    }
}