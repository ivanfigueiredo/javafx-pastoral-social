import { Repository } from "typeorm";
import { DoacaoRepository } from "../../application/port/out/DoacaoRepository";
import { Connection } from "./database/Connection";
import { DoacaoRecebidaEntity } from "./entities/DoacaoRecebidaEntity";
import { UnitOfWork } from "./unitOfWork/UnitOfWork";

export class DoacaoPostgresDatabase implements DoacaoRepository {
    private readonly doacaoRepository: Repository<DoacaoRecebidaEntity>;

    constructor(
        private readonly connection: Connection,
        private readonly unitOfWork: UnitOfWork
    ) {
        this.doacaoRepository = connection.getDataSourcer().getRepository(DoacaoRecebidaEntity);
    }

    public async saveMany(doacoes: DoacaoRecebidaEntity[]): Promise<void> {
        await this.unitOfWork.transactionMany(DoacaoRecebidaEntity, doacoes);
    }
}