import { ComunidadeDTO } from "../../dto/ComunidadeDTO";
import { TipoAjudaEnum } from "../../dto/enuns/TipoAjudaEnum";
import { FamiliaFilterQueryDTO } from "../../dto/familias/FamiliaFilterQueryDTO";
import { ListarFamiliasPrioritariasDTO } from "../../dto/familias/ListasFamiliasPrioritariasDTO";
import { OpcaoListaDTO } from "../../dto/OpcaoListaDTO";
import { PaginatedDTO } from "../../dto/PaginatedDTO";

export interface GetFamiliaUseCase {
    listarComunidade: () => Promise<ComunidadeDTO[]>;
    listarFamilias: (dto: FamiliaFilterQueryDTO) => Promise<PaginatedDTO>;
    listarFamiliaOpcaoLista: () => Promise<OpcaoListaDTO[]>;
    consultarFamiliaPrioridade: (tipoAjuda: TipoAjudaEnum) => Promise<ListarFamiliasPrioritariasDTO[]>;
}