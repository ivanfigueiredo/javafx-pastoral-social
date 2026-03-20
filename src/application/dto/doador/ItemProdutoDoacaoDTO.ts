import { BadRequestException } from "../../exceptions/BadRequestException";

export class ItemProdutoDoacaoDTO {
    constructor(readonly idItemProduto: number, readonly quantidade: number) {
        if (idItemProduto === null || idItemProduto === undefined) {
            throw new BadRequestException("O campo idItemProduto é obrigatório.");
        }
        if (quantidade === null || quantidade === undefined) {
            throw new BadRequestException("O campo quantidade é obrigatório.");
        }
    }
}