import { Repository } from "typeorm";
import { AjudaRepository } from "../../application/port/out/AjudaRepository";
import { AjudaRecebidaEntity } from "./entities/AjudaRecebidaEntity";
import { Connection } from "./database/Connection";
import { Logger } from "pino";
import { InternalServerErrorException } from "../../application/exceptions/InternalServerErrorException";

export class AjudaRecebidaPostgresDatabase implements AjudaRepository {
    private readonly ajudaRepository: Repository<AjudaRecebidaEntity>;
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly connection: Connection
    ) {
        this.logger = logger.child({ service: 'AjudaRepository' });
        this.ajudaRepository = connection.getDataSourcer().getRepository(AjudaRecebidaEntity);
    }

    public async criarAjuda(ajudas: AjudaRecebidaEntity[]): Promise<void> {
        try {
            await this.ajudaRepository.save(ajudas);
        } catch(e: any) {
            this.logger.error({err: e.message}, 'Error ao persistir ajuda');
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }

    public async save(ajuda: AjudaRecebidaEntity): Promise<void> {
        try {
            await this.ajudaRepository.save(ajuda);
        } catch(e: any) {
            this.logger.error({err: e.message}, 'Error ao persistir ajuda');
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }
}