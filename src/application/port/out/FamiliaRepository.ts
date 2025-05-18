import { AssociarFamiliaComDificuldadeDTO } from "../../dto/AssociarFamiliaComDificuldadeDTO";
import { CadastrarFamiliaDTO } from "../../dto/CadastrarFamiliaDTO";
import { ComunidadeDTO } from "../../dto/ComunidadeDTO";
import { DificuldadeDTO } from "../../dto/DificuldadeDTO";
import { FamiliaCadastradaDTO } from "../../dto/FamiliaCadastradaDTO";

export interface FamiliaRepository {
    save: (dto: CadastrarFamiliaDTO) => Promise<FamiliaCadastradaDTO>;
    saveFamiliaDificuldade: (dto: AssociarFamiliaComDificuldadeDTO) => Promise<void>;
    findComunidades: () => Promise<ComunidadeDTO[]>;
    findFamilias: () => Promise<any>;
    findDificuldades: () => Promise<DificuldadeDTO[]>;
}