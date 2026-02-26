import { CadastrarAcaoDTO } from "../../dto/CadastrarAcaoDTO";

export interface AcaoUseCase {
    cadastrarAcao: (dto: CadastrarAcaoDTO) => Promise<any>;
    listarAcoes: () => Promise<any>;
}