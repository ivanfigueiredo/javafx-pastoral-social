import { AjudaFilterQueryDTO } from "../../dto/AjudaFilterQueryDTO";
import { OpcaoListaDTO } from "../../dto/OpcaoListaDTO";

export interface ListarAjudasUseCase {
    listarAjudas: (dto: AjudaFilterQueryDTO) => Promise<any>;
    listarAjudasOpcaoLista: () => Promise<OpcaoListaDTO[]>;
}