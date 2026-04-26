import { Equal, Repository } from "typeorm";
import { Connection } from "./database/Connection";
import { UnitOfWork } from "./unitOfWork/UnitOfWork";
import { AcaoEntity } from "./entities/AcaoEntity";
import { AcaoRepository } from "../../application/port/out/AcaoRepository";
import { AcaoFilterQueryDTO } from "../../application/dto/acao/AcaoFilterQueryDTO";
import { StatusAcaoEnum } from "../../application/dto/enuns/StatusAcaoEnum";
import { InternalServerErrorException } from "../../application/exceptions/InternalServerErrorException";

export class AcaoPostgresDatabase implements AcaoRepository {
    private readonly acaoRepository: Repository<AcaoEntity>;

    constructor(
        private readonly connection: Connection,
        private readonly unitOfWork: UnitOfWork
    ) {
        this.acaoRepository = connection.getDataSourcer().getRepository(AcaoEntity);
    }

    public async updateStatusAcao(acaoId: number, status: StatusAcaoEnum): Promise<void> {
        await this.acaoRepository.update({ acaoId }, { statusAcao: status });
    }

    public async salvarAcao(acao: AcaoEntity): Promise<void> {
        await this.unitOfWork.transaction(AcaoEntity, acao);
    }

    public async listar(filter: AcaoFilterQueryDTO): Promise<[AcaoEntity[], number]> {
        const { page, pageSize } = filter;
        const idsQuery = this.acaoRepository
            .createQueryBuilder("acao")
            .select("acao.acaoId", "acaoId")
            .orderBy("acao.acaoId", "DESC")
            .skip((page - 1) * pageSize)
            .take(pageSize);
        if (filter.dataInicio) {
            idsQuery.andWhere("acao.dataEvento >= :dataInicio", { dataInicio: filter.dataInicio });
        }
        if (filter.dataFim) {
            idsQuery.andWhere("acao.dataEvento <= :dataFim", { dataFim: filter.dataFim });
        }
        if (filter.statusAcao) {
            const statusAcao = StatusAcaoEnum[filter.statusAcao.toUpperCase() as keyof typeof StatusAcaoEnum];
            idsQuery.andWhere("acao.statusAcao = :statusAcao", { statusAcao });
        }
        const ids = await idsQuery.getRawMany();
        if (ids.length === 0) {
            return [[], 0];
        }
        const query = this.acaoRepository.createQueryBuilder("acao")
            .leftJoinAndSelect("acao.templateAcao", "templateAcao")
            .leftJoinAndSelect("acao.doacoesRecebidas", "doacoesRecebidas")
            .leftJoinAndSelect("doacoesRecebidas.doador", "doador")
            .leftJoinAndSelect("doacoesRecebidas.itemProduto", "itemProduto")
            .leftJoinAndSelect("templateAcao.itensTemplate", "itensTemplate")
            .leftJoinAndSelect("itensTemplate.itemProduto", "itemProdutoTemplate")
            .leftJoinAndSelect("itemProdutoTemplate.unidadeMedida", "unidadeMedida")
            .where("acao.acaoId IN (:...ids)", { ids: ids.map(i => i.acaoId) })
            .orderBy("acao.acaoId", "DESC");
        return query.getManyAndCount();
    }

    public async findById(idAcao: number): Promise<AcaoEntity | null> {
        return this.acaoRepository.findOne({
            where: { acaoId: idAcao },
            relations: {
                templateAcao: {
                    itensTemplate: {
                        itemProduto: {
                            unidadeMedida: true
                        }
                    }
                },
                doacoesRecebidas: {
                    itemProduto: true,
                    doador: true
                }
            }
        });
    }

    public async findByInicioAcao(): Promise<AcaoEntity | null> {
        const hoje = new Date();
        const dataLocal = new Date(
            hoje.getFullYear(),
            hoje.getMonth(),
            hoje.getDate()
        );
        const now = dataLocal.toISOString().split("T")[0];
        return this.acaoRepository.findOne({
            where: { inicioAcao: Equal(now), statusAcao: StatusAcaoEnum.PLANEJADA }
        });
    }

    public async countAcoesByStatus(statusAcao: StatusAcaoEnum): Promise<number> {
        try {
            return await this.acaoRepository.count({ where: { statusAcao } });
        } catch (e: any) {
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }
}