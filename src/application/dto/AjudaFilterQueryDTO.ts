
import { StatusAjudaEnum } from "./enuns/StatusAjudaEnum";
import { TipoAjudaEnum } from "./enuns/TipoAjudaEnum";

export class AjudaFilterQueryDTO {
    constructor(
        readonly page: number,
        readonly pageSize: number,
        readonly statusAjuda: StatusAjudaEnum,
        readonly tipoAjuda?: TipoAjudaEnum,
        readonly dataInicio?: Date,
        readonly dataFim?: Date
    ) {}
}