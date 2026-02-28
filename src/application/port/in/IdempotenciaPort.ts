import { StatusIdempotenciaEnum } from "../../dto/enuns/StatusIdempotenciaEnum";
import { IdempotencyDTO } from "../../dto/idempotency/IdempotencyDTO";

export interface IdempotenciaPort {
    hasProcessado: (hash: string) => Promise<boolean>;
    salvarIdempotenciaRecord: (data: IdempotencyDTO) => Promise<void>;
    generateHash: (data: any) => string;
    concluirProcessamento: (hash: string) => Promise<void>;
}