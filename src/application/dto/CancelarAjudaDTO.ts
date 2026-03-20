import { BadRequestException } from "../exceptions/BadRequestException";

export class CancelarAjudaDTO {
    constructor(readonly idAjuda: number) {
        if (idAjuda === null || idAjuda === undefined) {
            throw new BadRequestException("O campo idAjuda é obrigatório.");
        }
    }
}