import { CestasDTO } from "./CestasDTO";

export class GetCestasDTO {
    constructor(
        readonly totalCestas: number,
        readonly cestasEntregues: number,
        readonly cestas: CestasDTO[]
    ) {}
}
