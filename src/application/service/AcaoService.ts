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
import { NivelNecessidadeDoacaoEnum } from "../dto/enuns/NivelNecessidadeDoacaoEnum";
import { AtualizarAcaoDTO } from "../dto/acao/AtualizarAcaoDTO";
import { NotFoundException } from "../exceptions/NotFoundException";
import { ItemTemplateRepository } from "../port/out/ItemTemplateRepository";

export class AcaoService implements AcaoUseCase {
    private readonly logger: Logger;

    constructor(
        private readonly estoqueUseCase: EstoqueUseCase,
        private readonly acaoRepository: AcaoRepository,
        private readonly unitOfwork: UnitOfWorkPort,
        logger: Logger,
        private readonly idempotenciaPort: IdempotenciaPort,
        private readonly itemTemplateRepository: ItemTemplateRepository
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
                    if (!dto.itens || dto.itens.length === 0) throw new UnprocessableException(`O campo itens precisa ser preenchido para tipo de ação: ${dto.tipoAcao}`);
                    const tipoTemplate = (dto.tipoAcao === TipoAcaoEnum.CESTA_BASICA) ? TemplateTypeEnum.CESTA_BASICA : TemplateTypeEnum.ALMOCO;
                    const templateExistente = await this.itemTemplateRepository.existeTemplateByItens(dto.itens, tipoTemplate);
                    if (templateExistente) {
                        acao.templateAcao = templateExistente;
                    } else {
                        const templateCriado = await this.estoqueUseCase.criarModeloTemplateAcao(dto.itens!, tipoTemplate);
                        const template = new TemplateEntity(templateCriado.idTemplate, null, null, [], [], null);
                        acao.templateAcao = template;
                    }
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
            const totalPlanejadas = await this.acaoRepository.countAcoesByStatus(StatusAcaoEnum.PLANEJADA);
            const totalEmAndamento = await this.acaoRepository.countAcoesByStatus(StatusAcaoEnum.EM_ANDAMENTO);
            const totalConcluidas = await this.acaoRepository.countAcoesByStatus(StatusAcaoEnum.CONCLUIDA);
            const result = await Promise.all(
                acoes.map(async (acao) => {
                    const qtdItensGerados = (acao.tipoAcao === TipoAcaoEnum.CESTA_BASICA) ?
                        await this.getCalculaPercentualItensGerados(acao, acao.qtdAcaoSocial!) : this.getItensGeradosAcaoSocial(acao);
                    return {
                        acaoId: acao.acaoId!,
                        titulo: acao.titulo,
                        descricao: acao.descricao,
                        tipoAcao: TipoAcao[acao.tipoAcao!],
                        totalAcaoSocial: (acao.qtdAcaoSocial !== null) ? acao.qtdAcaoSocial : 0,
                        dataConclusaoAcao: acao.dataEvento,
                        inicioAcao: acao.inicioAcao,
                        statusAcao: StatusAcaoEnum[acao.statusAcao!],
                        percentualRecebido: `${qtdItensGerados}`,
                        itensRecebidos: (acao.doacoesRecebidas != null) ? this.somarDoacoes(acao.doacoesRecebidas) : 0,
                        qtdDoadores: (acao.doacoesRecebidas != null) ? this.getTotalDoadores(acao.doacoesRecebidas) : 0,
                        itensGerados: `${qtdItensGerados}/${(acao.qtdAcaoSocial !== null) ? acao.qtdAcaoSocial : 0}`,
                        itens: (acao.tipoAcao === TipoAcaoEnum.CESTA_BASICA || acao.tipoAcao === TipoAcaoEnum.JANTA) ? 
                            this.getItensDoacao(acao.templateAcao!.itensTemplate) : []
                    }
                })
            );
            const response = {
                totalAcoes: totalAcoes,
                planejadas: totalPlanejadas,
                emAndamento: totalEmAndamento,
                concluidas: totalConcluidas,
                data: result
            }
            return new PaginatedDTO(dto.page, totalAcoes, Math.ceil(totalAcoes / dto.pageSize), response);
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

    private calculatePeso(itemTemplate: ItemTemplateEntity): string | undefined {
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

    private async getCalculaPercentualItensGerados(acao: AcaoEntity, qtdTotal: number): Promise<number> {
        if (acao.doacoesRecebidas != null && acao.doacoesRecebidas.length > 0) {
            const qtdAtual = acao.templateAcao!.itensTemplate.reduce((sum, item) => sum + item.quantidade, 0);
            return (qtdAtual / qtdTotal) * 100;
        }
        return 0;
    }

    public async getAcao(idAcao: string): Promise<any> {
        try {
            const acao = await this.acaoRepository.findById(parseInt(idAcao));
            if (!acao) throw new NotFoundException("Ação não encontrada");
            const totalAcaoSocial = (acao.qtdAcaoSocial !== null) ? acao.qtdAcaoSocial : 0;
            const qtdItensGerados = (acao.tipoAcao === TipoAcaoEnum.CESTA_BASICA) ?
                await this.getCalculaPercentualItensGerados(acao, acao.qtdAcaoSocial!) : this.getItensGeradosAcaoSocial(acao);
            return {
                acaoId: acao.acaoId!,
                titulo: acao.titulo,
                descricao: acao.descricao,
                tipoAcao: TipoAcao[acao.tipoAcao!],
                totalAcaoSocial: totalAcaoSocial,
                dataConclusaoAcao: acao.dataEvento,
                inicioAcao: acao.inicioAcao,
                statusAcao: StatusAcaoEnum[acao.statusAcao!],
                itensRecebidos: (acao.doacoesRecebidas != null) ? this.somarDoacoes(acao.doacoesRecebidas) : 0,
                percentualRecebido: `${qtdItensGerados}`,
                itensGerados: `${qtdItensGerados}/${(acao.qtdAcaoSocial !== null) ? acao.qtdAcaoSocial : 0}`,
                qtdDoadores: (acao.doacoesRecebidas != null) ? this.getTotalDoadores(acao.doacoesRecebidas) : 0,                          
                itens: (acao.tipoAcao === TipoAcaoEnum.CESTA_BASICA || acao.tipoAcao === TipoAcaoEnum.JANTA) ?
                        acao.templateAcao!.itensTemplate.map(item => ({
                            idItemProduto: item.itemProduto.id, 
                            nomeProduto: item.itemProduto.itemProdutoDesc, 
                            unidadeMedida: item.itemProduto.unidadeMedida!.undMedidas,
                            nivelNecessidadeDoacao: (acao.doacoesRecebidas !== null && acao.doacoesRecebidas.length > 0) ?
                                (
                                    (acao.tipoAcao === TipoAcaoEnum.CESTA_BASICA) ? 
                                        this.getNivelNecessidadeDoacao(acao.doacoesRecebidas, item.itemProduto.id, item, totalAcaoSocial) 
                                        : this.getNivelNecessidadeDoacaoAcaoSocial(acao.doacoesRecebidas, item.itemProduto.id, item)
                                    ) : NivelNecessidadeDoacaoEnum.CRITICAL
                        }))
                    : []
            }
        } catch (e: any) {
            this.logger.error({error: e.message}, 'Erro ao buscar acao');
            if (e instanceof NotFoundException) throw e;
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }   
    }

    private getItensGeradosAcaoSocial(acao: AcaoEntity): number {
        let percentualRecebido = 0;
        let qtdItensNecessarios = 0;
        if (acao.doacoesRecebidas != null && acao.doacoesRecebidas.length > 0) {
            acao.templateAcao!.itensTemplate.forEach(itemTemplate => {
                qtdItensNecessarios += itemTemplate.quantidade;
                percentualRecebido += acao.doacoesRecebidas!.filter(doacao => doacao.itemProduto!.id === itemTemplate.itemProduto.id)
                    .reduce((quantidade, doacao) => quantidade + doacao.quantidade!, 0);
                if (percentualRecebido > qtdItensNecessarios) {
                    percentualRecebido = qtdItensNecessarios;
                }
            });
            const result = (percentualRecebido / qtdItensNecessarios);
            percentualRecebido = (result == 1) ? 100 : this.formatNumber(result);
        }
        return percentualRecebido;
    }

    private formatNumber(value: number): number {
        return Math.trunc(value * 100);
    }

    private getNivelNecessidadeDoacao(doacoes: DoacaoRecebidaEntity[], itemProdutoId: number, itemTemplate: ItemTemplateEntity, totalAcaoSocial: number): string {
        const qtd =doacoes.filter(doacao => doacao.itemProduto!.id === itemProdutoId)
            .reduce((quantidade, doacao) => quantidade + doacao.quantidade!, 0);
        const qtdMinimaDoacaoRecebida = (qtd / (itemTemplate.quantidade * totalAcaoSocial)) * 100;
        if (qtdMinimaDoacaoRecebida <= 35) return NivelNecessidadeDoacaoEnum.CRITICAL;
        if (qtdMinimaDoacaoRecebida > 35 && qtdMinimaDoacaoRecebida <= 70) return NivelNecessidadeDoacaoEnum.HIGH;
        if (qtdMinimaDoacaoRecebida > 70 && qtdMinimaDoacaoRecebida <= 98) return NivelNecessidadeDoacaoEnum.MEDIUM;
        return NivelNecessidadeDoacaoEnum.LOW;
    }

    private getNivelNecessidadeDoacaoAcaoSocial(doacoes: DoacaoRecebidaEntity[], itemProdutoId: number, itemTemplate: ItemTemplateEntity): string {
        const qtd =doacoes.filter(doacao => doacao.itemProduto!.id === itemProdutoId)
            .reduce((quantidade, doacao) => quantidade + doacao.quantidade!, 0);
        let qtdMinimaDoacaoRecebida = (qtd / itemTemplate.quantidade);
        if (qtdMinimaDoacaoRecebida == 1) return NivelNecessidadeDoacaoEnum.LOW;
        qtdMinimaDoacaoRecebida = (qtdMinimaDoacaoRecebida * 100);
        if (qtdMinimaDoacaoRecebida <= 35) return NivelNecessidadeDoacaoEnum.CRITICAL;
        if (qtdMinimaDoacaoRecebida > 35 && qtdMinimaDoacaoRecebida <= 70) return NivelNecessidadeDoacaoEnum.HIGH;
        if (qtdMinimaDoacaoRecebida > 70 && qtdMinimaDoacaoRecebida <= 98) return NivelNecessidadeDoacaoEnum.MEDIUM;
        return NivelNecessidadeDoacaoEnum.LOW;
    }

    public async atualizarAcao(dto: AtualizarAcaoDTO): Promise<void> {
        try {
            await this.unitOfwork.startTransaction();
            const acao = await this.acaoRepository.findById(parseInt(dto.idAcao));
            if (!acao) throw new UnprocessableException("Ação não encontrada");
            if (acao.statusAcao === StatusAcaoEnum.CONCLUIDA) throw new UnprocessableException("Ação concluída não pode ser atualizada.");
            if (dto.titulo) acao.titulo = dto.titulo;
            if (dto.descricao) acao.descricao = dto.descricao;
            if (dto.dataEvento) acao.dataEvento = dto.dataEvento;
            if (dto.inicioAcao) acao.inicioAcao = dto.inicioAcao;
            await this.acaoRepository.salvarAcao(acao);
            await this.unitOfwork.commit();
        } catch (e: any) {
            this.logger.error({error: e.message}, 'Erro ao atualizar acao');
            await this.unitOfwork.rollBack();
            if (e instanceof UnprocessableException) throw e;
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        } finally {
            await this.unitOfwork.release();
        }
    }
}
