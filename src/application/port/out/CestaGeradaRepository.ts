import { CestaGeradaEntity } from "../../../adapters/persistence/entities/CestaGeradaEntity";
import { CestaFilterQueryDTO } from "../../dto/CestaFilterQueryDTO";

export interface CestaGeradaRepository {
    save: (cesta: CestaGeradaEntity) => Promise<CestaGeradaEntity>;
    findCestaById: (idCesta: number) => Promise<CestaGeradaEntity | null>;
    filterCestas: (filter: CestaFilterQueryDTO) => Promise<[CestaGeradaEntity[], number]>;
    countCestasEntregue: () => Promise<number>;
}