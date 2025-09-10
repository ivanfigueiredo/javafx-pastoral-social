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
}