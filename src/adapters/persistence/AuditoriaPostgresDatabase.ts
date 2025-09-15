import { Repository } from "typeorm";
import { AuditoriaRepository } from "../../application/port/out/AuditoriaRepository";
import { AuditoriaEntity } from "./entities/AuditoriaEntity";
import { Connection } from "./database/Connection";
import { InternalServerErrorException } from "../../application/exceptions/InternalServerErrorException";

export class AuditoriaPostgresDatabase implements AuditoriaRepository {
    private readonly auditoriaRepository: Repository<AuditoriaEntity>;

    constructor(private readonly connection: Connection) {
        this.auditoriaRepository = this.connection.getDataSourcer().getRepository(AuditoriaEntity);
    }

    public async registrarAuditoria(auditoriaEntity: AuditoriaEntity): Promise<void> {
        try {
            await this.auditoriaRepository.save(auditoriaEntity);
        } catch(error: any) {
            console.log(`Error ==>> ${JSON.stringify(error)}`);
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }
}