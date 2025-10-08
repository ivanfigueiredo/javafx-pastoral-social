import { CestaGeradaEntity } from "../../../adapters/persistence/entities/CestaGeradaEntity";

export interface CestaGeradaRepository {
    saveMany: (cestas: CestaGeradaEntity[]) => Promise<void>;
    findCestaById: (idCesta: number) => Promise<CestaGeradaEntity | null>;
}