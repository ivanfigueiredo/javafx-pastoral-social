import { AcaoEntity } from "../../../adapters/persistence/entities/AcaoEntity";
import { AcaoFilterQueryDTO } from "../../dto/acao/AcaoFilterQueryDTO";

export interface AcaoRepository {
    salvarAcao: (acao: AcaoEntity) => Promise<void>
    listar: (filter: AcaoFilterQueryDTO) => Promise<[AcaoEntity[], number]>;
}