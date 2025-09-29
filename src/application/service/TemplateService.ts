import { ConsultaGeracaoTemplateDTO } from "../dto/ConsultaGeracaoTemplateDTO";
import { GetTemplatesDTO } from "../dto/GetTemplatesDTO";
import { EstoqueUseCase } from "../port/in/EstoqueUseCase";
import { TemplateUseCase } from "../port/in/TemplateUseCase";
import { TemplateRepository } from "../port/out/TemplateRepository";
import { PaginatedDTO } from "../dto/PaginatedDTO";

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
            return {
                idTemplate: data.idTemplate,
                descricao: data.descricao,
                qtdPossivelGeracao: result.quantidadePossivel
            };
        }));
        const paginated = new PaginatedDTO(parseInt(`${dto.page}`), total, Math.ceil(total / dto.pageSize), result);
        return paginated;
    }
}

type result = {
    idTemplate: number;
    descricao: string;
    itensTemplate: {quantidade: number, itemProdutoId: number}[];
}