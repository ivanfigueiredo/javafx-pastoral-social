import { ComunidadeDTO } from "../../dto/ComunidadeDTO";
import { TipoAjudaEnum } from "../../dto/enuns/TipoAjudaEnum";
import { ListarFamiliasPrioritariasDTO } from "../../dto/familias/ListasFamiliasPrioritariasDTO";

export interface GetFamiliaUseCase {
    listarComunidade: () => Promise<ComunidadeDTO[]>;
    listarFamilias: () => Promise<any>;
    consultarFamiliaPrioridade: (tipoAjuda: TipoAjudaEnum) => Promise<ListarFamiliasPrioritariasDTO[]>;
}