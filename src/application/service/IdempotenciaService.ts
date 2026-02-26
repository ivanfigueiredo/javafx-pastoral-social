import { IdempotencyDTO } from "../dto/idempotency/IdempotencyDTO";
import { IdempotenciaPort } from "../port/in/IdempotenciaPort";
import { createHash } from 'crypto';
import { IdempotenciaRepository } from "../port/out/IdempotenciaRepository";
import { ControlleIdempotenciaEntity } from "../../adapters/persistence/entities/ControlleIdempotenciaEntity";
import { StatusIdempotenciaEnum } from "../dto/enuns/StatusIdempotenciaEnum";

export class IdempotenciaService implements IdempotenciaPort {
    constructor(private readonly idempotenciaRepository: IdempotenciaRepository) {}
    
    public generateHash(data: any): string {
        const json = JSON.stringify(data);
        return createHash("sha256")
            .update(json)
            .digest("hex");
    }

    public async hasProcessado(hash: string): Promise<boolean> {
        return this.idempotenciaRepository.hasProcessado(hash);
    }


    public async salvarIdempotenciaRecord(data: IdempotencyDTO): Promise<void> {
        const idempotencia = new ControlleIdempotenciaEntity(data.hash, false, data.payloadData, StatusIdempotenciaEnum.PENDENTE, data.contexto);
        await this.idempotenciaRepository.salvar(idempotencia);
    }

    public async atualizarStatus(hash: string, status: StatusIdempotenciaEnum): Promise<void> {
        await this.idempotenciaRepository.updateStatus(hash, status);
    }
}