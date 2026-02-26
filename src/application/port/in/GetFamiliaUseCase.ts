import { ComunidadeDTO } from "../../dto/ComunidadeDTO";
import { TipoAjudaEnum } from "../../dto/enuns/TipoAjudaEnum";
import { OpcaoListaDTO } from "../../dto/OpcaoListaDTO";

export interface GetFamiliaUseCase {
    listarComunidade: () => Promise<ComunidadeDTO[]>;
    listarFamilias: () => Promise<any>;
    listarFamiliaOpcaoLista: () => Promise<OpcaoListaDTO[]>;
    consultarFamiliaPrioridade: (tipoAjuda: TipoAjudaEnum) => Promise<any>;
}