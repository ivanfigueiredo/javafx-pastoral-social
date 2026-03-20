import { BadRequestException } from "../exceptions/BadRequestException";

export class GerarCestasDTO {
    constructor(readonly idTemplate: number) {
        if (idTemplate === null || idTemplate === undefined) {
            throw new BadRequestException("O campo idTemplate é obrigatório.");
        }
    }
}