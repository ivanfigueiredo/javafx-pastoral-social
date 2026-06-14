import { BadRequestException } from "../../exceptions/BadRequestException";

export class CadastroEstoqueV2DTO {
    constructor(
        readonly validade: Date, 
        readonly itemProdutoId: number,
        readonly codProduto: string,
        readonly quantidade: number
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
        if (quantidade === null || quantidade === undefined) {
            throw new BadRequestException("O campo quantidade é obrigatório.");
        }
    }
}