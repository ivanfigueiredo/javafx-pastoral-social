import { Repository } from "typeorm";
import { Logger } from 'pino';
import { AuditoriaRepository } from "../../application/port/out/AuditoriaRepository";
import { AuditoriaEntity } from "./entities/AuditoriaEntity";
import { Connection } from "./database/Connection";
import { InternalServerErrorException } from "../../application/exceptions/InternalServerErrorException";

export class AuditoriaPostgresDatabase implements AuditoriaRepository {
    private readonly auditoriaRepository: Repository<AuditoriaEntity>;
    private readonly logger: Logger;

    constructor(
        private readonly connection: Connection,
        logger: Logger
    ) {
        this.logger = logger.child({service: 'AuditoriaPostgresDatabase'});
        this.auditoriaRepository = this.connection.getDataSourcer().getRepository(AuditoriaEntity);
    }

    public async registrarAuditoria(auditoriaEntity: AuditoriaEntity): Promise<void> {
        try {
            await this.auditoriaRepository.save(auditoriaEntity);
        } catch(error: any) {
            this.logger.error({ err: error.message }, "Erro inesperado");
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }
}