import { Logger } from 'pino';
import { ItemTemplateEntity } from "../../adapters/persistence/entities/ItemTemplateEntity";
import { CadastroEstoqueDTO } from "../dto/CadastroEstoqueDTO";
import { ConsultaGeracaoTemplateDTO } from "../dto/ConsultaGeracaoTemplateDTO";
import { TemplateTypeEnum } from "../dto/enuns/TemplateTypeEnum";
import { EstoqueDTO } from "../dto/EstoqueDTO";
import { GeracaoModeloTemplateDTO } from "../dto/GeracaoModeloTemplateDTO";
import { ItemProdutoDTO } from "../dto/ItemProdutoDTO";
import { ModeloTemplateCriadoResponse } from "../dto/ModeloTemplateCriadoResponseDTO";
import { RespostaConsultaGeracaoTemplateDTO } from "../dto/RespostaConsultaGeracaoTemplateDTO";
import { UnidadeDeMedidadDTO } from "../dto/UnidadeDeMedidaDTO";
import { InternalServerErrorException } from "../exceptions/InternalServerErrorException";
import { UnprocessableException } from "../exceptions/UnprocessableException";
import { EstoqueUseCase } from "../port/in/EstoqueUseCase";
import { EstoqueRepository } from "../port/out/EstoqueRepository";
import { ItemTemplateRepository } from "../port/out/ItemTemplateRepository";
import { TemplateRepository } from "../port/out/TemplateRepository";
import { UnitOfWorkPort } from "../port/out/UnitOfWorkPort";
import { ItemProdutoEntity } from '../../adapters/persistence/entities/ItemProdutoEntity';
import { StatusCestaEntity } from '../../adapters/persistence/entities/StatusCestaEntity';
import { StatusCestaEnum } from '../dto/enuns/StatusCestaEnum';
import { CestaGeradaEntity } from '../../adapters/persistence/entities/CestaGeradaEntity';
import { CestaGeradaRepository } from '../port/out/CestaGeradaRepository';
import { CestaEstoqueItemRepository } from '../port/out/CestaEstoqueItemRepository';
import { CestaEstoqueItemEntity } from '../../adapters/persistence/entities/CestaEstoqueItemEntity';
import { EstoqueMapper } from '../../adapters/mappers/EstoqueMapper';
import { EstoqueEntity } from '../../adapters/persistence/entities/EstoqueEntity';
import { EstoqueDisponivelDTO } from '../dto/EstoqueDisponivelDTO';
import { SugerirModeloTemplateResponseDTO, TemplateModeloFilhosDTO } from '../dto/SugerirModeloTemplateResponseDTO';
import { TemplateItemDTO } from '../dto/TemplateItemDTO';
import { CriarTemplateDTO } from '../dto/CriarTemplateDTO';

export class EstoqueService implements EstoqueUseCase {
    private readonly logger: Logger;
    private readonly QUANTIDADE_MAXIMA = 2;

    constructor(
        logger: Logger,
        private readonly estoqueRepository: EstoqueRepository,
        private readonly itemTemplateRepository: ItemTemplateRepository,
        private readonly templateRepository: TemplateRepository,
        private readonly cestaGeradaRepository: CestaGeradaRepository,
        private readonly cestaEstoqueItemRepository: CestaEstoqueItemRepository,
        private readonly unitOfWork: UnitOfWorkPort
    ) {
        this.logger = logger.child({ service: "EstoqueUseCase" });
    }

    public async sugerirModeloTemplate(): Promise<SugerirModeloTemplateResponseDTO> {
        try {
            const result = await this.estoqueRepository.buscarEstoqueDisponivel();
            if (result == null || result == undefined || result.length < 0) {
                return new SugerirModeloTemplateResponseDTO([]);
            }
            const ordenandoListaProdutos: EstoqueDisponivelDTO[] = result.filter(r => r.quantidade > 0)
                .sort((a, b) => a.quantidade - b.quantidade)
                .map(r => ({itemProdutoId: r.itemProdutoId, quantidade: r.quantidade}));
            const modeloRestricaoPrimario = {
                templateItens: ordenandoListaProdutos.map(r => new EstoqueDisponivelDTO(r.itemProdutoId, this.getMenorQuantidade(ordenandoListaProdutos)))
            }
            const modeloRestricaoSecundario = this.getRestricaoModelo([...ordenandoListaProdutos]);
            const modeloRestricaoTerciario = this.getRestricaoModelo([...modeloRestricaoSecundario.templateItens])
            const response = new SugerirModeloTemplateResponseDTO([modeloRestricaoPrimario, modeloRestricaoSecundario, modeloRestricaoTerciario]);
            return response;
        } catch (e: any) {
            this.logger.error({ err: e.message }, 'Erro ao sugerir modelo ');
            return new SugerirModeloTemplateResponseDTO([]);
        }
    }

    private getRestricaoModelo(listEstoqueDisponivel: EstoqueDisponivelDTO[]): TemplateModeloFilhosDTO {
        listEstoqueDisponivel.shift();
        return {
            templateItens: listEstoqueDisponivel.map(r => new EstoqueDisponivelDTO(r.itemProdutoId, this.getMenorQuantidade(listEstoqueDisponivel)))
        }
    }

    private getMenorQuantidade(estoqueDisponivel: EstoqueDisponivelDTO[]): number {
        const menorQuantidade = estoqueDisponivel[0].quantidade;
        return (menorQuantidade < this.QUANTIDADE_MAXIMA) ? menorQuantidade : this.QUANTIDADE_MAXIMA;
    }

    public async cadastrar(dto: CadastroEstoqueDTO): Promise<void> {
        try {
            await this.unitOfWork.startTransaction();
            if (this.isProdutoForaValidade(dto.validade)) throw new UnprocessableException("O produto informado está fora da validade.");
            const estoqueEntity = EstoqueMapper.toEstoqueEntity(dto);
            await this.estoqueRepository.saveMany([estoqueEntity]);
            await this.unitOfWork.commit();
            await this.unitOfWork.release();
        } catch (e: any) {
            this.logger.error({ err: e.message }, 'Erro ao persistir ')
            await this.unitOfWork.rollBack();
            if (e instanceof UnprocessableException) throw e;
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.");
        }
    };

    private isProdutoForaValidade(data: Date): boolean {
        const dataAtual = new Date();
        const dataValidade = new Date(data);
        return dataAtual.getTime() > dataValidade.getTime();
    }

    public async deletar(idEstoque: number): Promise<void> {
        try {
            await this.estoqueRepository.deleteOne(idEstoque);
        } catch (e: any) {
            this.logger.error({ err: e.message }, 'Erro ao persistir ')
        }
    }

    public async listarUnidadeMedida(): Promise<UnidadeDeMedidadDTO[]> {
        return await this.estoqueRepository.findUnidadeDeMedidas();
    }

    public async listarItemProduto(): Promise<ItemProdutoDTO[]> {
        return await this.estoqueRepository.findITemProduto();
    }

    public async listarEstoqueByIdItemProduto(idItemProduto: number): Promise<EstoqueDTO[]> {
        return await this.estoqueRepository.findEstoqueByIdItemProduto(idItemProduto);
    }

    public async consultarGeracaoTemplate(dto: ConsultaGeracaoTemplateDTO): Promise<RespostaConsultaGeracaoTemplateDTO> {
        const result = await this.estoqueRepository.consultaGeracaoTemplate(dto.templateItens);
        return new RespostaConsultaGeracaoTemplateDTO(result);
    }

    public async criarModeloTemplateAcao(templateItens: TemplateItemDTO[], templateType: TemplateTypeEnum): Promise<any> {
        try {
            const template = new CriarTemplateDTO("Template ação social", templateType);
            const templateEntity = await this.templateRepository.save(template);
            for (const templateItem of templateItens) {
                templateItem.itemProdutoId
                const itemProdutoEntity = new ItemProdutoEntity(templateItem.itemProdutoId, null, null, null, [], []);
                const itemTemplate = new ItemTemplateEntity(null, templateItem.quantidade, templateEntity, itemProdutoEntity);
                await this.itemTemplateRepository.save(itemTemplate);
                this.logger.info({idItemTemplate: itemTemplate.id} , 'Item template cadastrado com sucesso.');
            }
            return { idTemplate: templateEntity.id }
        } catch (e: any) {
            this.logger.error({error: e.message}, 'Error ')
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.");
        }
    }

    public async gerarModeloTemplate(dto: GeracaoModeloTemplateDTO): Promise<ModeloTemplateCriadoResponse> {
        try {
            await this.unitOfWork.startTransaction();
            if (dto.template.gerarCestas && dto.template.templateType != TemplateTypeEnum.CESTA_BASICA) {
                this.logger.error({ templateType: dto.template.templateType }, "Não é possível gerar cestas básicas para um tipo de template diferente de CESTA_BASICA");
                throw new UnprocessableException(`Não é possível gerar cestas básicas para um tipo de template diferente de CESTA_BASICA`);
            }
            const consultGeracaoTemplate = new ConsultaGeracaoTemplateDTO(dto.templateItens);
            const result = await this.consultarGeracaoTemplate(consultGeracaoTemplate);
            if (result.quantidadePossivel == 0) {
                this.logger.error({ quantidadePossivel: result.quantidadePossivel, templateDescricao: dto.template.templateDesc }, "Estoque indisponível para o template informado.");
                throw new UnprocessableException(`Estoque indisponível para o modelo de template informado: '${dto.template.templateDesc}'.`);
            }
            const templateEntity = await this.templateRepository.save(dto.template);
            for (const templateItem of dto.templateItens) {
                templateItem.itemProdutoId
                const itemProdutoEntity = new ItemProdutoEntity(templateItem.itemProdutoId, null, null, null, [], []);
                const itemTemplate = new ItemTemplateEntity(null, templateItem.quantidade, templateEntity, itemProdutoEntity);
                await this.itemTemplateRepository.save(itemTemplate);
                this.logger.info({idItemTemplate: itemTemplate.id} , 'Item template cadastrado com sucesso.');
            }
            if (dto.template.gerarCestas) {
                for (let i = 0; i < dto.qtdGeracaoPossivel; i++) {
                    const statusCesta = new StatusCestaEntity(StatusCestaEnum.CRIADA, null, []);
                    const cesta = new CestaGeradaEntity(null, new Date(), templateEntity, statusCesta, [], null);
                    const cestaGerada = await this.cestaGeradaRepository.save(cesta);
                    this.logger.info({idCesta: cestaGerada.id}, 'Cesta gerada com sucesso');
                    for (const templateItem of dto.templateItens) {
                        const qtdNecessarioTotal = templateItem.quantidade;
                        const estoqueItens = await this.estoqueRepository.findEstoqueByItemProdutoIdAndQtdGeracaoTemplate(templateItem.itemProdutoId, qtdNecessarioTotal);
                        for (const estoque of estoqueItens) {
                            estoque.dataSaida = new Date();
                            estoque.isDisponivel = false;
                            const cestaEstoqueItem = new CestaEstoqueItemEntity(cestaGerada.id!, estoque.id!, estoque, cestaGerada);
                            await this.cestaEstoqueItemRepository.save(cestaEstoqueItem);
                        }
                        await this.estoqueRepository.saveMany(estoqueItens);
                    }
                }
            }
            await this.unitOfWork.commit();
            return new ModeloTemplateCriadoResponse(templateEntity.id!);
        } catch(e: any) {
            this.logger.error({error: e.message}, 'Error ')
            await this.unitOfWork.rollBack();
            if (e instanceof InternalServerErrorException) {
                throw e;
            }
            if (e instanceof UnprocessableException) {
                throw e;
            }
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.");
        } finally {
            await this.unitOfWork.release();
        }
    }
    
}