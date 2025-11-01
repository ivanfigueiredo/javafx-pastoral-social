import { AjudaRecebidaEntity } from "../../../adapters/persistence/entities/AjudaRecebidaEntity";
import { AjudaFilterQueryDTO } from "../../dto/AjudaFilterQueryDTO";

export interface AjudaRepository {
    criarAjuda: (ajuda: AjudaRecebidaEntity[]) => Promise<void>;
    findAjudaById: (idAjuda: number) => Promise<AjudaRecebidaEntity | null>;
    findAjudas: (dto: AjudaFilterQueryDTO) => Promise<[AjudaRecebidaEntity[], number]>;
    save: (ajuda: AjudaRecebidaEntity) => Promise<void>;
}