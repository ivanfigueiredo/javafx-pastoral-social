import { TipoDificuldadeEnum } from "../enuns/TipoDificuldadeEnum";

export class FamiliaFilterQueryDTO {
    constructor(
        readonly page: number,
        readonly pageSize: number,
        readonly tipoDificuldade?: TipoDificuldadeEnum
    ) {}
}