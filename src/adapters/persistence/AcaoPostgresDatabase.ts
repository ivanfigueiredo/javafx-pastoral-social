import { Repository } from "typeorm";
import { Connection } from "./database/Connection";
import { UnitOfWork } from "./unitOfWork/UnitOfWork";
import { AcaoEntity } from "./entities/AcaoEntity";
import { AcaoRepository } from "../../application/port/out/AcaoRepository";
import { AcaoFilterQueryDTO } from "../../application/dto/acao/AcaoFilterQueryDTO";

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

    public async listar(filter: AcaoFilterQueryDTO): Promise<[AcaoEntity[], number]> {
        const { page, pageSize } = filter;
        const query = this.acaoRepository.createQueryBuilder("acao")
            .leftJoinAndSelect("acao.templateAcao", "templateAcao")
            .leftJoinAndSelect("acao.doacoesRecebidas", "doacoesRecebidas")
            .leftJoinAndSelect("doacoesRecebidas.doador", "doador")
            .leftJoinAndSelect("doacoesRecebidas.itemProduto", "itemProduto")
            .leftJoinAndSelect("templateAcao.itensTemplate", "itensTemplate")
            .leftJoinAndSelect("itensTemplate.itemProduto", "itemProdutoTemplate")
            .orderBy("acao.acaoId", "DESC")
            .skip((page - 1) * pageSize)
            .take(pageSize);
        
        if (filter.dataInicio) {
            query.andWhere("acao.dataEvento >= :dataInicio", { dataInicio: filter.dataInicio });
        }
        if (filter.dataFim) {
            query.andWhere("acao.dataEvento <= :dataFim", { dataFim: filter.dataFim });
        }
        return query.getManyAndCount();
    }
}