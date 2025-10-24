import { AjudaRecebidaEntity } from "../../../adapters/persistence/entities/AjudaRecebidaEntity";

export interface AjudaRepository {
    criarAjuda: (ajuda: AjudaRecebidaEntity[]) => Promise<void>;
    findAjudaById: (idAjuda: number) => Promise<AjudaRecebidaEntity | null>;
    save: (ajuda: AjudaRecebidaEntity) => Promise<void>;
}