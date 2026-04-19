
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
    ) {
        if (dataInicio) {
            if (!(dataInicio instanceof Date) || isNaN(dataInicio.getTime())) {
                throw new Error("dataInicio deve ser uma data válida");
            }
        }
        if (dataFim) {
            if (!(dataFim instanceof Date) || isNaN(dataFim.getTime())) {
                throw new Error("dataFim deve ser uma data válida");
            }
        }
        if (dataInicio && dataFim && dataInicio > dataFim) {
            throw new Error("dataInicio não pode ser maior que dataFim");
        }
    }
}