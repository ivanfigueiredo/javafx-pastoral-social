import { AjudaFilterQueryDTO } from "../../dto/AjudaFilterQueryDTO";

export interface ListarAjudasUseCase {
    execute: (dto: AjudaFilterQueryDTO) => Promise<any>
}