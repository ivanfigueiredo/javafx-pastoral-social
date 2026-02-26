import { ConsultaGeracaoTemplateDTO } from "../dto/ConsultaGeracaoTemplateDTO";
import { GetTemplatesDTO } from "../dto/GetTemplatesDTO";
import { EstoqueUseCase } from "../port/in/EstoqueUseCase";
import { TemplateUseCase } from "../port/in/TemplateUseCase";
import { TemplateRepository } from "../port/out/TemplateRepository";
import { PaginatedDTO } from "../dto/PaginatedDTO";
import { ItemsData } from "../dto/CestasDTO";
import { UnidadeMedidaEnum } from "../dto/enuns/UnidadeMedidaEnum";
import { ItemTemplateEntity } from "../../adapters/persistence/entities/ItemTemplateEntity";
import { InternalServerErrorException } from "../exceptions/InternalServerErrorException";
import { Logger } from "pino";

export class TemplateService implements TemplateUseCase {
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly templateRepository: TemplateRepository,
        private readonly estoqueUseCase: EstoqueUseCase
    ) {
        this.logger = logger.child({service: "TemplateService"})
    }

    public async getDetalheTemplate(templateId: number): Promise<any> {
        throw new Error("Method not implemented.");
    }

    public async listarTemplates(dto: GetTemplatesDTO): Promise<any> {
        const [templates, total] = await this.templateRepository.findPaginatedTemplate(dto.page, dto.pageSize);
        const result = await Promise.all(templates.map(async template => {
            let data: Result = {
                idTemplate: template.id!,
                descricao: template.descricao!,
                itensTemplate: []
            }
            template.itensTemplate.forEach(item => data.itensTemplate.push({
                itemProdutoId: item.itemProduto.id,
                quantidade: item.quantidade,
            }))
            const result = await this.estoqueUseCase.consultarGeracaoTemplate(new ConsultaGeracaoTemplateDTO(data.itensTemplate));
            const output = template.itensTemplate.map(item => ({
                itemProdutoId: item.itemProduto.id,
                nomeProduto: `${item.itemProduto.itemProdutoDesc} (${this.calculatePeso(item)})`,
                quantidade: item.quantidade,
                unidadeMedida: item.itemProduto.unidadeMedida!.undMedidas,
                valor: item.itemProduto.valorMedida
            })) as ItemsData[];
            const removeDuplicate = new Set(output.map(item => JSON.stringify(item)));
            const newListItensData = Array.from(removeDuplicate).map(item => JSON.parse(item)) as ItemsData[];
            const qtdItens = newListItensData.reduce((acc, item) => acc + item.quantidade, 0);
            return {
                idTemplate: data.idTemplate,
                descricao: data.descricao,
                itensModelo: qtdItens,
                qtdPossivelGeracao: result.quantidadePossivel,
                itens: newListItensData
            };
        }));
        const paginated = new PaginatedDTO(parseInt(`${dto.page}`), total, Math.ceil(total / dto.pageSize), result);
        return paginated;
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
        }
    }

    public async listarTemplatesOpcaoLista(): Promise<any> {
        try {
            const templates = await this.templateRepository.findTemplatesOpcaoLista();
            return templates;
        } catch (e: any) {
            this.logger.error({error: e.message}, 'Erro ao listar opções de template');
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }
}

type Result = {
    idTemplate: number;
    descricao: string;
    itensTemplate: {quantidade: number, itemProdutoId: number}[];
}