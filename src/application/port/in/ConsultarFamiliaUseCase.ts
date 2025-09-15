import { ComunidadeDTO } from "../../dto/ComunidadeDTO";
import { DificuldadeDTO } from "../../dto/DificuldadeDTO";

export interface ConsultarFamiliaUseCase {
    listarComunidades: () => Promise<ComunidadeDTO[]>;
    listarFamilias: () => Promise<any>;
    listarDificuldades: () => Promise<DificuldadeDTO[]>;
}