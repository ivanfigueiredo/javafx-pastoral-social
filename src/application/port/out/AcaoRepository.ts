import { AcaoEntity } from "../../../adapters/persistence/entities/AcaoEntity";

export interface AcaoRepository {
    salvarAcao: (acao: AcaoEntity) => Promise<void>
    listar: () => Promise<AcaoEntity[]>;
}