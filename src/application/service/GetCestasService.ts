import { Logger } from "pino";
import { AcaoSocialTemplateEntity } from "../../adapters/persistence/entities/AcaoSocialTemplateEntity";
import { EstoqueEntity } from "../../adapters/persistence/entities/EstoqueEntity";
import { CestaFilterQueryDTO } from "../dto/CestaFilterQueryDTO";
import { UnidadeMedidaEnum } from "../dto/enuns/UnidadeMedidaEnum";
import { GetCestasUseCase } from "../port/in/GetCestasUseCase";
import { CestaGeradaRepository } from "../port/out/CestaGeradaRepository";
import { CestasDTO, ItemsData } from "../dto/CestasDTO";
import { GetCestasDTO } from "../dto/GetCestasDTO";
import { CalculateProgressoEnum } from "../dto/enuns/CalculateProgressoEnum";
import { PaginatedDTO } from "../dto/PaginatedDTO";

export class GetCestasService implements GetCestasUseCase {
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly cestaRepository: CestaGeradaRepository,
    ) {
        this.logger = logger.child({ service: 'GetCestasUseCase' })
    }

    public async execute(dto: CestaFilterQueryDTO): Promise<any> {
        let cesta: CestasDTO = {
            idCesta: 0,
            identificadorCesta: '',
            descricao: '',
            progresso: '',
            totalItensCesta: 0,
            status: '',
            itens: []
        }
        const cestasResult: CestasDTO[] = [];
        try {
            const [cestas, total] = await this.cestaRepository.filterCestas(dto);
            for (let i = 0; i < cestas.length; i++) {
                const output = cestas[i].template.acoes.flatMap(acao => {
                    return acao.itensTemplate.map(item => ({
                        itemProdutoId: item.estoque.itemProduto.id,
                        nomeProduto: `${item.estoque.itemProduto.itemProdutoDesc} (${this.calculatePeso(item.estoque, item.acaoSocialTemplate)})`,
                        quantidade: item.acaoSocialTemplate.quantidade,
                        unidadeMedida: item.estoque.itemProduto.unidadeMedida!.undMedidas,
                        valor: item.estoque.valorMedida
                    })) as ItemsData[];
                });
                const removeDuplicate = new Set(output.map(item => JSON.stringify(item)));
                const newListItensData = Array.from(removeDuplicate).map(item => JSON.parse(item)) as ItemsData[];
                const qtdItens = newListItensData.reduce((acc, item) => acc + item.quantidade, 0);
                cesta = {
                    idCesta: cestas[i].id!,
                    identificadorCesta: cestas[i].identificadorCesta!,
                    descricao: cestas[i].template.descricao,
                    status: cestas[i].status.statusDesc!,
                    totalItensCesta: qtdItens,
                    progresso: CalculateProgressoEnum[cestas[i].status.statusDesc!],
                    itens: newListItensData
                }
                cestasResult.push(cesta);
            }
            const cestasEntregues = await this.cestaRepository.countCestasEntregue();
            const response = new GetCestasDTO(total, cestasEntregues, cestasResult);
            const paginated = new PaginatedDTO(parseInt(`${dto.page}`), total, Math.ceil(total / dto.pageSize), response);
            return paginated;
        } catch (e: any) {
            this.logger.error({ error: e.message }, 'Erro ao consultar cestas ');
            throw e;
        }
    }
    
    private calculatePeso(estoque: EstoqueEntity, acao: AcaoSocialTemplateEntity): any {
        if (estoque.itemProduto.unidadeMedida!.undMedidas == UnidadeMedidaEnum.KG) {
            return `${estoque.valorMedida * acao.quantidade}KG`;
        } else if (estoque.itemProduto.unidadeMedida!.undMedidas == UnidadeMedidaEnum.G) {
            const sum = estoque.valorMedida * acao.quantidade;
            const converteKG = (sum / 1000);
            return (converteKG > 1) ? `${converteKG}KG` : `${sum}G`;
        }
    }
}
