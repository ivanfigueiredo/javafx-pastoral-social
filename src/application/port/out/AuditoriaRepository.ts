import { AuditoriaEntity } from "../../../adapters/persistence/entities/AuditoriaEntity";

export interface AuditoriaRepository {
    registrarAuditoria: (auditoriaEntity: AuditoriaEntity) => Promise<void>;
}