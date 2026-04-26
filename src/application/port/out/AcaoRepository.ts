import { AcaoEntity } from "../../../adapters/persistence/entities/AcaoEntity";
import { AcaoFilterQueryDTO } from "../../dto/acao/AcaoFilterQueryDTO";
import { StatusAcaoEnum } from "../../dto/enuns/StatusAcaoEnum";

export interface AcaoRepository {
    salvarAcao: (acao: AcaoEntity) => Promise<void>;
    findById: (idAcao: number) => Promise<AcaoEntity | null>;
    listar: (filter: AcaoFilterQueryDTO) => Promise<[AcaoEntity[], number]>;
    findByInicioAcao: () => Promise<AcaoEntity | null>;
    updateStatusAcao: (acaoId: number, status: StatusAcaoEnum) => Promise<void>
    countAcoesByStatus: (statusAcao: StatusAcaoEnum) => Promise<number>
}