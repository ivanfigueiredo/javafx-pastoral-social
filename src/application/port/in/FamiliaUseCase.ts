import { CadastrarFamiliaDTO } from "../../dto/CadastrarFamiliaDTO";
import { ComunidadeDTO } from "../../dto/ComunidadeDTO";
import { DificuldadeDTO } from "../../dto/DificuldadeDTO";

export interface FamiliaUseCase {
    cadastrar: (dto: CadastrarFamiliaDTO) => Promise<void>;
    listarComunidades: () => Promise<ComunidadeDTO[]>;
    listarFamilias: () => Promise<any>;
    listarDificuldades: () => Promise<DificuldadeDTO[]>;
}