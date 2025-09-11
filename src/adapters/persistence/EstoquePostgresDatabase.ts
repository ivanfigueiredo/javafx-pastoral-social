import { Repository } from "typeorm";
import { CadastroEstoqueDTO } from "../../application/dto/CadastroEstoqueDTO";
import { ItemProdutoDTO } from "../../application/dto/ItemProdutoDTO";
import { LocalizacaoDTO } from "../../application/dto/LocalizacaoDTO";
import { UnidadeDeMedidadDTO } from "../../application/dto/UnidadeDeMedidaDTO";
import { EstoqueRepository } from "../../application/port/out/EstoqueRepository";
import { Connection } from "./database/Connection";
import { EstoqueEntity } from "./entities/EstoqueEntity";
import { EstoqueMapper } from "../mappers/EstoqueMapper";
import { UnidadeMedidaEntity } from "./entities/UnidadeDeMedidaEntity";
import { LocalizacaoEntity } from "./entities/LocalizacaoEntity";
import { ItemProdutoEntity } from "./entities/ItemProdutoEntity";
import { EstoqueDTO } from "../../application/dto/EstoqueDTO";
import { TemplateItemDTO } from "../../application/dto/TemplateItemDTO";

export class EstoquePostgresDatabase implements EstoqueRepository {
    private readonly estoqueRepository: Repository<EstoqueEntity>;
    private readonly unidadeDeMedidaRepository: Repository<UnidadeMedidaEntity>;
    private readonly localizacaoRepository: Repository<LocalizacaoEntity>;
    private readonly itemProdutoRepository: Repository<ItemProdutoEntity>;

    constructor(private readonly connection: Connection) {
        this.estoqueRepository = this.connection.getDataSourcer().getRepository(EstoqueEntity);
        this.unidadeDeMedidaRepository = this.connection.getDataSourcer().getRepository(UnidadeMedidaEntity);
        this.localizacaoRepository = this.connection.getDataSourcer().getRepository(LocalizacaoEntity);
        this.itemProdutoRepository = this.connection.getDataSourcer().getRepository(ItemProdutoEntity);
    }

    public async save(dto: CadastroEstoqueDTO): Promise<void> {
        await this.estoqueRepository.save(EstoqueMapper.toAlimentoEntity(dto));
    }

    public async deleteOne(idAlimento: number): Promise<void> {
        try {
            await this.estoqueRepository.delete(idAlimento);
        } catch (error) {}
    }

    public async findUnidadeDeMedidas(): Promise<UnidadeDeMedidadDTO[]> {
        const listUnd = await this.unidadeDeMedidaRepository.find();
        return EstoqueMapper.toUnidadeDeMedidaDTO(listUnd);
    }

    public async findLocalizacao(): Promise<LocalizacaoDTO[]> {
        const listLocalizacao = await this.localizacaoRepository.find();
        return EstoqueMapper.toLocalizacaoDTO(listLocalizacao);
    }

    public async findITemProduto(): Promise<ItemProdutoDTO[]> {
        const listItemProduto = await this.itemProdutoRepository.find();
        return EstoqueMapper.toItemProdutoDTO(listItemProduto);
    }

    public async findEstoque(): Promise<EstoqueDTO[]> {
        const listEstoque = await this.estoqueRepository.createQueryBuilder('tea')
            .leftJoin('tea.itemProduto', 'tip')
            .leftJoin('tea.localizacao', 'tle')
            .leftJoin('tea.unidadeMedida', 'tum')
            .select([
                'tea.id',
                'tea.validade',
                'tea.dataEntrada',
                'tea.dataSaida',
                'tip.id',
                'tip.itemProdutoDesc',
                'tle.id',
                'tle.localizacaoDesc',
                'tum.id',
                'tum.undMedidas'
            ])
            .getMany();
        return EstoqueMapper.toEstoqueDTO(listEstoque);
    }

    public async consultaGeracaoTemplate(templateItens: TemplateItemDTO[]): Promise<number> {
        const result = await this.estoqueRepository
            .createQueryBuilder("e")
            .innerJoin(ItemProdutoEntity, "p", "e.id_item_produto = p.id_produto")
            .where("e.data_saida IS NULL")
            .andWhere("p.validade >= CURRENT_DATE")
            .select("e.id_item_produto", "id_item_produto")
            .addSelect("COUNT(*)", "disponivel")
            .groupBy("e.id_item_produto")
            .getRawMany();

        const estoqueMap: Record<number, number> = {};
        for (const row of result) {
            const id = Number(row.id_item_produto);
            const disponivel = Number(row.disponivel);
            estoqueMap[id] = disponivel;
        }
        const totalItens = this.calculaGeracaoTemplate(templateItens, estoqueMap);
        return totalItens;
    }

    private calculaGeracaoTemplate(templateItens: TemplateItemDTO[], estoque: Record<number, number>): number {
        let total = Infinity;
        for (const item of templateItens) {
            const disponivel = estoque[item.itemProdutoId] ?? 0;
            const possivel = Math.floor(disponivel / item.quantidade);
            total = Math.min(total, possivel);
        }
        return total === Infinity ? 0 : total;
    }
}
