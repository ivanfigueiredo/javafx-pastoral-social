import { DoacaoRecebidaEntity } from "../../../adapters/persistence/entities/DoacaoRecebidaEntity";

export interface DoacaoRepository {
    saveMany: (doacoes: DoacaoRecebidaEntity[]) => Promise<void>;
}