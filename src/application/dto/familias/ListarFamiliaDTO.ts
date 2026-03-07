import { FamiliaDTO } from "./FamiliaDTO";


export class ListarFamiliaDTO {
    constructor(
        readonly totalFamilias: number,
        readonly familias: FamiliaDTO[]
    ) {}
}