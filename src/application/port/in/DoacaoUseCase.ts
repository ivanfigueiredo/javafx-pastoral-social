import { CadastrarDoacaoDTO } from "../../dto/doador/CadastrarDoacaoDTO";
import { SejaDoadorDTO } from "../../dto/doador/SejaDoadorDTO";

export interface DoacaoUseCase {
    cadastrarDoacao: (dto: CadastrarDoacaoDTO) => Promise<void>;
    sejaDoador: (dto: SejaDoadorDTO) => Promise<void>;
}