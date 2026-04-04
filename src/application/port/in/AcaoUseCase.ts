import { AcaoFilterQueryDTO } from "../../dto/acao/AcaoFilterQueryDTO";
import { CadastrarAcaoDTO } from "../../dto/CadastrarAcaoDTO";
import { PaginatedDTO } from "../../dto/PaginatedDTO";

export interface AcaoUseCase {
    cadastrarAcao: (dto: CadastrarAcaoDTO) => Promise<void>;
    listarAcoes: (dto: AcaoFilterQueryDTO) => Promise<PaginatedDTO>;
    getAcao: (idAcao: string) => Promise<any>;
}