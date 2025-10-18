import { TipoAjudaEnum } from "./enuns/TipoAjudaEnum";

export class AssociarAjudaFamiliaDTO {
    constructor(
        readonly idFamilia: number, 
        readonly ajuda: AjudaDTO
    ) {}
}

export class AjudaDTO {
    constructor(
        readonly tipoAjuda: TipoAjudaEnum,
        readonly observacao: string,
        readonly idTemplate: number
    ) {}
}