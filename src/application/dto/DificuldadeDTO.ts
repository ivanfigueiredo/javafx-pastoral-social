import { BadRequestException } from "../exceptions/BadRequestException";

export class DificuldadeDTO {
    constructor(readonly idDificuldade: number, readonly descricao: string) {
        if (idDificuldade === null || idDificuldade === undefined) {
            throw new BadRequestException("O campo idDificuldade é obrigatório.");
        }
        if (descricao === null || descricao === undefined) {
            throw new BadRequestException("O campo descricao é obrigatório.");
        }
    }
}