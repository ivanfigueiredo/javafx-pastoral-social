import { AjudaRecebidaEntity } from "../../../adapters/persistence/entities/AjudaRecebidaEntity";

export interface AjudaRepository {
    criarAjuda: (ajuda: AjudaRecebidaEntity[]) => Promise<void>;
    save: (ajuda: AjudaRecebidaEntity) => Promise<void>;
}