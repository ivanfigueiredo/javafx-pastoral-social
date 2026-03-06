import { AjudaFilterQueryDTO } from "../../dto/AjudaFilterQueryDTO";
import { OpcaoListaDTO } from "../../dto/OpcaoListaDTO";
import { PaginatedDTO } from "../../dto/PaginatedDTO";

export interface ListarAjudasUseCase {
    listarAjudas: (dto: AjudaFilterQueryDTO) => Promise<PaginatedDTO>;
    listarAjudasOpcaoLista: () => Promise<OpcaoListaDTO[]>;
}