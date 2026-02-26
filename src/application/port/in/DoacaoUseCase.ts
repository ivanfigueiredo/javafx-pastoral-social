import { CadastrarDoacaoDTO } from "../../dto/doador/CadastrarDoacaoDTO";

export interface DoacaoUseCase {
    cadastrarDoacao: (dto: CadastrarDoacaoDTO) => Promise<void>;
}