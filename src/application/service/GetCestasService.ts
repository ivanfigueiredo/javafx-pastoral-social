import { Logger } from "pino";
import { CestaFilterQueryDTO } from "../dto/CestaFilterQueryDTO";
import { UnidadeMedidaEnum } from "../dto/enuns/UnidadeMedidaEnum";
import { GetCestasUseCase } from "../port/in/GetCestasUseCase";
import { CestaGeradaRepository } from "../port/out/CestaGeradaRepository";
import { CestasDTO, ItemsData } from "../dto/CestasDTO";
import { GetCestasDTO } from "../dto/GetCestasDTO";
import { CalculateProgressoEnum } from "../dto/enuns/CalculateProgressoEnum";
import { PaginatedDTO } from "../dto/PaginatedDTO";
import { ItemTemplateEntity } from "../../adapters/persistence/entities/ItemTemplateEntity";

export class GetCestasService implements GetCestasUseCase {
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly cestaRepository: CestaGeradaRepository,
    ) {
        this.logger = logger.child({ service: 'GetCestasUseCase' })
    }

    public async execute(dto: CestaFilterQueryDTO): Promise<PaginatedDTO> {
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
                const output = cestas[i].cestaItens.map(cestaItem => {
                    const itemTemplate = cestas[i].template.itensTemplate.find(itemTemplate => itemTemplate.itemProduto.id == cestaItem.cestaEstoqueItem.itemProduto.id)!;
                    return ({
                        itemProdutoId: cestaItem.cestaEstoqueItem.itemProduto.id,
                        nomeProduto: `${cestaItem.cestaEstoqueItem.itemProduto.itemProdutoDesc} (${this.calculatePeso(itemTemplate)})`,
                        quantidade: itemTemplate.quantidade,
                        unidadeMedida: cestaItem.cestaEstoqueItem.itemProduto.unidadeMedida!.undMedidas,
                        valor: cestaItem.cestaEstoqueItem.itemProduto.valorMedida
                    });
                }) as ItemsData[];
                const removeDuplicate = new Set(output.map(item => JSON.stringify(item)));
                const newListItensData = Array.from(removeDuplicate).map(item => JSON.parse(item)) as ItemsData[];
                const qtdItens = newListItensData.reduce((acc, item) => acc + item.quantidade, 0);
                cesta = {
                    idCesta: cestas[i].id!,
                    identificadorCesta: cestas[i].identificadorCesta!,
                    descricao: cestas[i].template.descricao!,
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
    
    private calculatePeso(itemTemplate: ItemTemplateEntity): any {
        if (itemTemplate.itemProduto.unidadeMedida!.undMedidas == UnidadeMedidaEnum.KG) {
            return `${itemTemplate.quantidade}${itemTemplate.itemProduto.unidadeMedida!.undMedidas}`;
        } else if (itemTemplate.itemProduto.unidadeMedida!.undMedidas == UnidadeMedidaEnum.G) {
            const sum = itemTemplate.itemProduto.valorMedida! * itemTemplate.quantidade;
            const converteKG = (sum / 1000);
            return (converteKG >= 1) ? `${converteKG}${UnidadeMedidaEnum.KG}` : `${sum}${UnidadeMedidaEnum.G}`;
        } else if (itemTemplate.itemProduto.unidadeMedida!.undMedidas == UnidadeMedidaEnum.ML) {
            const sum = itemTemplate.itemProduto.valorMedida! * itemTemplate.quantidade;
            const converteKG = (sum / 1000);
            return (converteKG >= 1) ? `${converteKG}${UnidadeMedidaEnum.L}` : `${sum}${UnidadeMedidaEnum.ML}`;
        } else if (itemTemplate.itemProduto.unidadeMedida!.undMedidas == UnidadeMedidaEnum.L) {
            return `${itemTemplate.quantidade}${UnidadeMedidaEnum.L}`;
        } else {
            return `${itemTemplate.quantidade}${UnidadeMedidaEnum.UND}`;
        }
    }
}
