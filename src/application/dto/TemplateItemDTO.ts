import { BadRequestException } from "../exceptions/BadRequestException";

export class TemplateItemDTO {
    constructor(readonly itemProdutoId: number, readonly quantidade: number) {
        if (itemProdutoId === null || itemProdutoId === undefined) {
            throw new BadRequestException("O campo itemProdutoId é obrigatório.");
        }
        if (quantidade === null || quantidade === undefined) {
            throw new BadRequestException("O campo quantidade é obrigatório.");
        }
    }
}