import { ComunidadeDTO } from "../../dto/ComunidadeDTO";

export interface GetFamiliaUseCase {
    listarComunidade: () => Promise<ComunidadeDTO[]>;
    listarFamilias: () => Promise<any>;
}