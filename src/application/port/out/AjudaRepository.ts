import { AjudaRecebidaEntity } from "../../../adapters/persistence/entities/AjudaRecebidaEntity";
import { AjudaFilterQueryDTO } from "../../dto/AjudaFilterQueryDTO";
import { StatusAjudaEnum } from "../../dto/enuns/StatusAjudaEnum";
import { OpcaoListaDTO } from "../../dto/OpcaoListaDTO";

export interface AjudaRepository {
    criarAjuda: (ajuda: AjudaRecebidaEntity[]) => Promise<void>;
    findAjudaById: (idAjuda: number) => Promise<AjudaRecebidaEntity | null>;
    findAjudas: (dto: AjudaFilterQueryDTO) => Promise<[AjudaRecebidaEntity[], number]>;
    findAjudasOpcaoLista: () => Promise<OpcaoListaDTO[]>;
    save: (ajuda: AjudaRecebidaEntity) => Promise<void>;
    countAjudasByStatus: (statusAjuda: StatusAjudaEnum) => Promise<number>
}