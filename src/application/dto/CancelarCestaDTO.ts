import { BadRequestException } from "../exceptions/BadRequestException";

export class CancelarCestaDTO {
    constructor(readonly idCesta: number) {
        if (idCesta === null || idCesta === undefined) {
            throw new BadRequestException("O campo idCesta é obrigatório.");
        }
    }
}