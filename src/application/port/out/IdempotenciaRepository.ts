import { ControlleIdempotenciaEntity } from "../../../adapters/persistence/entities/ControlleIdempotenciaEntity";
import { StatusIdempotenciaEnum } from "../../dto/enuns/StatusIdempotenciaEnum";

export interface IdempotenciaRepository {
    salvar: (data: ControlleIdempotenciaEntity) => Promise<void>
    hasProcessado: (hash: string) => Promise<boolean>;
    updateStatus: (hash: string, status: StatusIdempotenciaEnum) => Promise<void>;
    deleteAll: () => Promise<void>;
}