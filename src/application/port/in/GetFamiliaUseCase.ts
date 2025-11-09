import { ComunidadeDTO } from "../../dto/ComunidadeDTO";
import { TipoAjudaEnum } from "../../dto/enuns/TipoAjudaEnum";

export interface GetFamiliaUseCase {
    listarComunidade: () => Promise<ComunidadeDTO[]>;
    listarFamilias: () => Promise<any>;
    consultarFamiliaPrioridade: (tipoAjuda: TipoAjudaEnum) => Promise<any>;
}