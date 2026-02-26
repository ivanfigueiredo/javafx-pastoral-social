import { Column, Entity, PrimaryColumn } from "typeorm";
import { ContextoIdempotencyEnum } from "../../../application/dto/enuns/ContextoIdempotencyEnum";
import { StatusIdempotenciaEnum } from "../../../application/dto/enuns/StatusIdempotenciaEnum";

@Entity('tps_controlle_idempotencia', {schema: 'config'})
export class ControlleIdempotenciaEntity {
    @PrimaryColumn({ name: "hash_data", type: "varchar", nullable: false })
    hashData: string | null;

    @Column({ name: "is_processado", type: "boolean", nullable: false })
    isProcessado: boolean | null;

    @Column({ name: "payload_data", type: "jsonb", nullable: true })
    payloadData: any | null;

    @Column({ name: "status", type: "enum", enum: StatusIdempotenciaEnum, nullable: false })
    status: StatusIdempotenciaEnum | null;

    @Column({ name: "contexto", type: "enum", enum: ContextoIdempotencyEnum, nullable: false })
    contexto: ContextoIdempotencyEnum | null;

    constructor(
        hashData: string | null,
        isProcessado: boolean | null,
        payloadData: any | null,
        status: StatusIdempotenciaEnum | null,
        contexto: ContextoIdempotencyEnum | null
    ) {
        this.hashData = hashData;
        this.isProcessado = isProcessado;
        this.payloadData = payloadData;
        this.contexto = contexto;
        this.status = status;
    }
}