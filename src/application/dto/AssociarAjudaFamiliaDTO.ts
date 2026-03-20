import { BadRequestException } from "../exceptions/BadRequestException";
import { TipoAjudaEnum } from "./enuns/TipoAjudaEnum";

export class AssociarAjudaFamiliaDTO {
    constructor(
        readonly idFamilia: number, 
        readonly ajuda: AjudaDTO
    ) {
        if (idFamilia === null || idFamilia === undefined) {
            throw new BadRequestException("O campo idFamilia é obrigatório.");
        }
        if (ajuda === null || ajuda === undefined) {
            throw new BadRequestException("O campo ajuda é obrigatório.");
        }
    }
}

export class AjudaDTO {
    constructor(
        readonly tipoAjuda: TipoAjudaEnum,
        readonly observacao: string,
        readonly idTemplate: number
    ) {
        if (tipoAjuda === null || tipoAjuda === undefined) {
            throw new BadRequestException("O campo tipoAjuda é obrigatório.");
        }
        if (idTemplate === null || idTemplate === undefined) {
            throw new BadRequestException("O campo idTemplate é obrigatório.");
        }
    }
}