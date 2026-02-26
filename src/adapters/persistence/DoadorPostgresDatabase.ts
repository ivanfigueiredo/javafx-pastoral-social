import { Repository } from "typeorm";
import { DoadorRepository } from "../../application/port/out/DoadorRepository";
import { Connection } from "./database/Connection";
import { DoadorEntity } from "./entities/DoadorEntity";
import { UnitOfWork } from "./unitOfWork/UnitOfWork";

export class DoadorPostgresDatabase implements DoadorRepository {
    private readonly doadorRepository: Repository<DoadorEntity>;

    constructor(
        private readonly connection: Connection,
        private readonly unitOfWork: UnitOfWork
    ) {
        this.doadorRepository = this.connection.getDataSourcer().getRepository(DoadorEntity);
    }

    public async findDoadorByTelefone(telefone: string): Promise<DoadorEntity | null> {
        return this.doadorRepository.findOne({where: {doadorTelefone: telefone}});
    }

    public async save(doador: DoadorEntity): Promise<DoadorEntity> {
        return this.unitOfWork.transaction(DoadorEntity, doador);
    }
}