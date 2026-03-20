import { BadRequestException } from "../exceptions/BadRequestException";

export class AssociarFamiliaComDificuldadeDTO {
    constructor(readonly idDificuldade: number, readonly idFamilia: number, readonly outros: string | null) {
        if (idDificuldade === null || idDificuldade === undefined) {
            throw new BadRequestException("O campo idDificuldade é obrigatório.");
        }
        if (idFamilia === null || idFamilia === undefined) {
            throw new BadRequestException("O campo idFamilia é obrigatório.");
        }
    }
}