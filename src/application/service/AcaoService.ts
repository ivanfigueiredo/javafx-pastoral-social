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
import { IdempotenciaPort } from "../port/in/IdempotenciaPort";
import { IdempotencyDTO } from "../dto/idempotency/IdempotencyDTO";
import { ContextoIdempotencyEnum } from "../dto/enuns/ContextoIdempotencyEnum";
import { PaginatedDTO } from "../dto/PaginatedDTO";
import { AcaoFilterQueryDTO } from "../dto/acao/AcaoFilterQueryDTO";

export class AcaoService implements AcaoUseCase {
    private readonly logger: Logger;

    constructor(
        private readonly estoqueUseCase: EstoqueUseCase,
        private readonly acaoRepository: AcaoRepository,
        private readonly unitOfwork: UnitOfWorkPort,
        logger: Logger,
        private readonly idempotenciaPort: IdempotenciaPort
    ) {
        this.logger = logger.child({ service: "AcaoUseCase" });
    }

    public async cadastrarAcao(dto: CadastrarAcaoDTO): Promise<void> {
        try {
            await this.unitOfwork.startTransaction();
            const payloadIdempotencia = {
                titulo: dto.titulo,
                dataEvento: dto.dataEvento,
                tipoAcao: dto.tipoAcao
            };
            const hash = this.idempotenciaPort.generateHash(payloadIdempotencia);
            const hasProcessado = await this.idempotenciaPort.hasProcessado(hash);
            if (!hasProcessado) {
                const idempotencyData = new IdempotencyDTO(hash, dto, ContextoIdempotencyEnum.CADASTRAR_ACAO);
                await this.idempotenciaPort.salvarIdempotenciaRecord(idempotencyData);
                const acao = new AcaoEntity(null, dto.titulo, dto.descricao, dto.dataEvento, dto.inicioAcao, new Date().toISOString(), dto.tipoAcao, null, null, StatusAcaoEnum.PLANEJADA, []);
                if (this.acaoIsValid(dto.tipoAcao)) {
                    if (!dto.qtdAcaoSocial || dto.qtdAcaoSocial < 0) throw new UnprocessableException(`O campo qtdAcaoSocial precisa ser preenchido para tipo de ação: ${dto.tipoAcao}`);
                    const tipoTemplate = (dto.tipoAcao === TipoAcaoEnum.CESTA_BASICA) ? TemplateTypeEnum.CESTA_BASICA : TemplateTypeEnum.ALMOCO;
                    const templateCriado = await this.estoqueUseCase.criarModeloTemplateAcao(dto.itens!, tipoTemplate);
                    const template = new TemplateEntity(templateCriado.idTemplate, null, null, [], [], null);
                    acao.templateAcao = template;
                    acao.qtdAcaoSocial = dto.qtdAcaoSocial;
                }
                await this.idempotenciaPort.concluirProcessamento(hash);
                await this.acaoRepository.salvarAcao(acao);
                await this.unitOfwork.commit();
            } else {
                this.logger.info("Requisição já processada anteriormente. Ignorando processamento.");
            }
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

    public async listarAcoes(dto: AcaoFilterQueryDTO): Promise<PaginatedDTO> {
        try {
            const [acoes, totalAcoes] = await this.acaoRepository.listar(dto);
            const response = await Promise.all(
                acoes.map(async (acao) => {
                    const qtdItensGerados = (acao.tipoAcao === TipoAcaoEnum.CESTA_BASICA || acao.tipoAcao === TipoAcaoEnum.JANTA) ?
                        await this.getItensGerados(acao.templateAcao!) : 0;
                    return {
                        acaoId: acao.acaoId!,
                        titulo: acao.titulo,
                        descricao: acao.descricao,
                        tipoAcao: TipoAcao[acao.tipoAcao!],
                        totalAcaoSocial: (acao.qtdAcaoSocial !== null) ? acao.qtdAcaoSocial : 0,
                        dataConclusaoAcao: acao.dataEvento,
                        statusAcao: StatusAcaoEnum[acao.statusAcao!],
                        percentualRecebido: (acao.qtdAcaoSocial != null && qtdItensGerados > 0) ? 
                            `${this.getCalculaPercentualItensGerados(qtdItensGerados, acao.qtdAcaoSocial!)}%` : '0',
                        itensRecebidos: (acao.doacoesRecebidas != null) ? this.somarDoacoes(acao.doacoesRecebidas) : 0,
                        qtdDoadores: (acao.doacoesRecebidas != null) ? this.getTotalDoadores(acao.doacoesRecebidas) : 0,
                        itensGerados: `${qtdItensGerados}/${(acao.qtdAcaoSocial !== null) ? acao.qtdAcaoSocial : 0}`,
                        itens: (acao.tipoAcao === TipoAcaoEnum.CESTA_BASICA || acao.tipoAcao === TipoAcaoEnum.JANTA) ?
                            (acao.doacoesRecebidas != null && acao.doacoesRecebidas.length > 0) ? this.getItensDoacao(acao.templateAcao!.itensTemplate) : []
                            : []
                    }
                })
            );
            return new PaginatedDTO(parseInt(`${dto.page}`), totalAcoes, Math.ceil(totalAcoes / dto.pageSize), response);
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
