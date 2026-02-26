import { Repository } from "typeorm";
import { StatusIdempotenciaEnum } from "../../application/dto/enuns/StatusIdempotenciaEnum";
import { IdempotenciaRepository } from "../../application/port/out/IdempotenciaRepository";
import { ControlleIdempotenciaEntity } from "./entities/ControlleIdempotenciaEntity";
import { Connection } from "./database/Connection";
import { InternalServerErrorException } from "../../application/exceptions/InternalServerErrorException";

export class IdempotenciaPostgresDatabase implements IdempotenciaRepository {
    private readonly repository: Repository<ControlleIdempotenciaEntity>;

    constructor(private readonly connection: Connection) {
        this.repository = connection.getDataSourcer().getRepository(ControlleIdempotenciaEntity);
    }

    public async salvar(data: ControlleIdempotenciaEntity): Promise<void> {
        try {
            await this.repository.save(data);
        } catch (e: any) {
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }

    public async hasProcessado(hash: string): Promise<boolean> {
        const result = await this.repository.findOne({ where: { hashData: hash, isProcessado: true, status: StatusIdempotenciaEnum.PROCESSADO } });
        return result != null;
    }

    public async updateStatus(hash: string, status: StatusIdempotenciaEnum): Promise<void> {
        await this.repository.update({ hashData: hash }, { status, isProcessado: true });
    }
}