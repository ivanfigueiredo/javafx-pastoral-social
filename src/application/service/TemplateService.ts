import { ConsultaGeracaoTemplateDTO } from "../dto/ConsultaGeracaoTemplateDTO";
import { GetTemplatesDTO } from "../dto/GetTemplatesDTO";
import { EstoqueUseCase } from "../port/in/EstoqueUseCase";
import { TemplateUseCase } from "../port/in/TemplateUseCase";
import { TemplateRepository } from "../port/out/TemplateRepository";
import { PaginatedDTO } from "../dto/PaginatedDTO";
import { ItemsData } from "../dto/CestasDTO";
import { EstoqueEntity } from "../../adapters/persistence/entities/EstoqueEntity";
import { AcaoSocialTemplateEntity } from "../../adapters/persistence/entities/AcaoSocialTemplateEntity";
import { UnidadeMedidaEnum } from "../dto/enuns/UnidadeMedidaEnum";

export class TemplateService implements TemplateUseCase {
    constructor(
        private readonly templateRepository: TemplateRepository,
        private readonly estoqueUseCase: EstoqueUseCase
    ) {}

    public async getDetalheTemplate(templateId: number): Promise<any> {
        throw new Error("Method not implemented.");
    }

    public async listarTemplates(dto: GetTemplatesDTO): Promise<any> {
        const [templates, total] = await this.templateRepository.findPaginatedTemplate(dto.page, dto.pageSize);
        const result = await Promise.all(templates.map(async template => {
            let data: result = {
                idTemplate: template.id!,
                descricao: template.descricao,
                itensTemplate: []
            }
            template.acoes
                .map(acao => acao.itensTemplate)
                    .map(itensTemplate => itensTemplate.flatMap(
                        item => data.itensTemplate.push({
                            itemProdutoId: item.estoque.itemProduto.id,
                            quantidade: item.acaoSocialTemplate.quantidade,
                        })
                    )
                )
            const result = await this.estoqueUseCase.consultarGeracaoTemplate(new ConsultaGeracaoTemplateDTO(data.itensTemplate));
            const output = template.acoes.flatMap(acao => {
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

type result = {
    idTemplate: number;
    descricao: string;
    itensTemplate: {quantidade: number, itemProdutoId: number}[];
}