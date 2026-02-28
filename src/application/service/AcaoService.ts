import { Logger } from "pino";
import { CadastrarAcaoDTO } from "../dto/CadastrarAcaoDTO";
import { TipoAcao, TipoAcaoEnum } from "../dto/enuns/TipoAcaoEnum";
import { AcaoUseCase } from "../port/in/AcaoUseCase";
import { EstoqueUseCase } from "../port/in/EstoqueUseCase";
import { TemplateTypeEnum } from "../dto/enuns/TemplateTypeEnum";
import { AcaoEntity } from "../../adapters/persistence/entities/AcaoEntity";
import { TemplateEntity } from "../../adapters/persistence/entities/TemplateEntity";
import { AcaoRepository } from "../port/out/AcaoRepository";
import { UnitOfWorkPort } from "../port/out/UnitOfWorkPort";
import { InternalServerErrorException } from "../exceptions/InternalServerErrorException";
import { UnprocessableException } from "../exceptions/UnprocessableException";
import { StatusAcaoEnum } from "../dto/enuns/StatusAcaoEnum";
import { DoacaoRecebidaEntity } from "../../adapters/persistence/entities/DoacaoRecebidaEntity";
import { ItemTemplateEntity } from "../../adapters/persistence/entities/./ItemTemplateEntity";
import { ConsultaGeracaoTemplateDTO } from "../dto/ConsultaGeracaoTemplateDTO";
import { TemplateItemDTO } from "../dto/TemplateItemDTO";
import { UnidadeMedidaEnum } from "../dto/enuns/UnidadeMedidaEnum";

export class AcaoService implements AcaoUseCase {
    private readonly logger: Logger;

    constructor(
        private readonly estoqueUseCase: EstoqueUseCase,
        private readonly acaoRepository: AcaoRepository,
        private readonly unitOfwork: UnitOfWorkPort,
        logger: Logger,
    ) {
        this.logger = logger.child({ service: "AcaoUseCase" });
    }

    public async cadastrarAcao(dto: CadastrarAcaoDTO): Promise<any> {
        try {
            await this.unitOfwork.startTransaction();
            const acao = new AcaoEntity(null, dto.titulo, dto.descricao, new Date(dto.dataEvento), new Date(), dto.tipoAcao, null, null, StatusAcaoEnum.ativa, []);
            if (this.acaoIsValid(dto.tipoAcao)) {
                if (!dto.qtdAcaoSocial || dto.qtdAcaoSocial < 0) throw new UnprocessableException(`O campo qtdAcaoSocial precisa ser preenchido para tipo de ação: ${dto.tipoAcao}`);
                const tipoTemplate = (dto.tipoAcao === TipoAcaoEnum.CESTA_BASICA) ? TemplateTypeEnum.CESTA_BASICA : TemplateTypeEnum.ALMOCO;
                const templateCriado = await this.estoqueUseCase.criarModeloTemplateAcao(dto.itens!, tipoTemplate);
                const template = new TemplateEntity(templateCriado.idTemplate, null, null, [], [], null);
                acao.templateAcao = template;
                acao.qtdAcaoSocial = dto.qtdAcaoSocial;
            }
            await this.acaoRepository.salvarAcao(acao);
            await this.unitOfwork.commit();
        } catch (e: any) {
            this.logger.error({error: e.message}, 'Erro ao cadastrar acao');
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        } finally {
            await this.unitOfwork.release();
        }
    }

    private acaoIsValid(tipoAcao: TipoAcaoEnum) {
        return tipoAcao === TipoAcaoEnum.CESTA_BASICA || tipoAcao === TipoAcaoEnum.JANTA;
    }

    public async listarAcoes(): Promise<any> {
        try {
            const acoes = await this.acaoRepository.listar();
            return Promise.all(
                acoes.map(async acao => {
                    const qtdItensGerados = await this.getItensGerados(acao.templateAcao!);
                    return {
                        titulo: acao.titulo,
                        descricao: acao.descricao,
                        tipoAcao: TipoAcao[acao.tipoAcao!],
                        totalAcaoSocial: acao.qtdAcaoSocial,
                        dataConclusaoAcao: acao.dataEvento,
                        percentualRecebido: (acao.qtdAcaoSocial != null && qtdItensGerados > 0) ? 
                            `${this.getCalculaPercentualItensGerados(qtdItensGerados, acao.qtdAcaoSocial!)}%` : '0',
                        itensRecebidos: (acao.doacoesRecebidas != null) ? this.somarDoacoes(acao.doacoesRecebidas) : 0,
                        qtdDoadores: (acao.doacoesRecebidas != null) ? this.getTotalDoadores(acao.doacoesRecebidas) : 0,
                        itensGerados: `${qtdItensGerados}/${acao.qtdAcaoSocial}`,
                        itens: (acao.tipoAcao == TipoAcaoEnum.CESTA_BASICA || acao.tipoAcao == TipoAcaoEnum.JANTA) ?
                            (acao.doacoesRecebidas != null) ? this.getItensDoacao(acao.templateAcao!.itensTemplate) : []
                            : []
                    }
                })
            );
        } catch (e: any) {
            this.logger.error({error: e.message}, 'Erro ao listar acao');
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }

    private somarDoacoes(doacoes: DoacaoRecebidaEntity[]): number {
        return doacoes.reduce((item, doacao) => item + doacao.quantidade!, 0);
    }

    private getItensDoacao(itensTemplate: ItemTemplateEntity[]): string[] {
        return itensTemplate.map(item => `${item.itemProduto.itemProdutoDesc!} (${this.calculatePeso(item)})`);
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

    private getTotalDoadores(doacaoRecebidas: DoacaoRecebidaEntity[]): number {
        return new Set(doacaoRecebidas.map(doacao => doacao.doador!.id)).size;
    }

    private async getItensGerados(template: TemplateEntity): Promise<number> {
        const output = await this.estoqueUseCase.consultarGeracaoTemplate(this.getTemplateITens(template.itensTemplate));
        return output.quantidadePossivel;
    }

    private getTemplateITens(itens: ItemTemplateEntity[]): ConsultaGeracaoTemplateDTO {
        return new ConsultaGeracaoTemplateDTO(itens.map(item => new TemplateItemDTO(item.itemProduto.id, item.quantidade)));
    }

    private getCalculaPercentualItensGerados(qtdAtual: number, qtdTotal: number): number {
        return (qtdAtual / qtdTotal) * 100;
    }
}
