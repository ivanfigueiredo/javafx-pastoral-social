import { Repository } from "typeorm";
import { Connection } from "./database/Connection";
import { UnitOfWork } from "./unitOfWork/UnitOfWork";
import { AcaoEntity } from "./entities/AcaoEntity";
import { AcaoRepository } from "../../application/port/out/AcaoRepository";

export class AcaoPostgresDatabase implements AcaoRepository {
    private readonly acaoRepository: Repository<AcaoEntity>;

    constructor(
        private readonly connection: Connection,
        private readonly unitOfWork: UnitOfWork
    ) {
        this.acaoRepository = connection.getDataSourcer().getRepository(AcaoEntity);
    }

    public async salvarAcao(acao: AcaoEntity): Promise<void> {
        await this.unitOfWork.transaction(AcaoEntity, acao);
    }

    public async listar(): Promise<AcaoEntity[]> {
        return this.acaoRepository.find({
            relations: {
                doacoesRecebidas: { doador: true, itemProduto: true },
                templateAcao: { itensTemplate: { itemProduto: true } },
            }
        });
    }
}