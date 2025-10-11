import { Logger } from 'pino';
import { AcaoSocialTemplateEntity } from "../../adapters/persistence/entities/AcaoSocialTemplateEntity";
import { CestaGeradaEntity } from "../../adapters/persistence/entities/CestaGeradaEntity";
import { ItemTemplateEntity } from "../../adapters/persistence/entities/ItemTemplateEntity";
import { StatusCestaEntity } from "../../adapters/persistence/entities/StatusCestaEntity";
import { CadastroEstoqueDTO } from "../dto/CadastroEstoqueDTO";
import { ConsultaGeracaoTemplateDTO } from "../dto/ConsultaGeracaoTemplateDTO";
import { StatusCestaEnum } from "../dto/enuns/StatusCestaEnum";
import { TemplateTypeEnum } from "../dto/enuns/TemplateTypeEnum";
import { EstoqueDTO } from "../dto/EstoqueDTO";
import { GeracaoModeloTemplateDTO } from "../dto/GeracaoModeloTemplateDTO";
import { ItemProdutoDTO } from "../dto/ItemProdutoDTO";
import { LocalizacaoDTO } from "../dto/LocalizacaoDTO";
import { ModeloTemplateCriadoResponse } from "../dto/ModeloTemplateCriadoResponseDTO";
import { RespostaConsultaGeracaoTemplateDTO } from "../dto/RespostaConsultaGeracaoTemplateDTO";
import { UnidadeDeMedidadDTO } from "../dto/UnidadeDeMedidaDTO";
import { InternalServerErrorException } from "../exceptions/InternalServerErrorException";
import { UnprocessableException } from "../exceptions/UnprocessableException";
import { EstoqueUseCase } from "../port/in/EstoqueUseCase";
import { AcaoSocialTemplateRepository } from "../port/out/AcaoSocialTemplateRepository";
import { EstoqueRepository } from "../port/out/EstoqueRepository";
import { ItemTemplateRepository } from "../port/out/ItemTemplateRepository";
import { TemplateRepository } from "../port/out/TemplateRepository";
import { UnitOfWorkPort } from "../port/out/UnitOfWorkPort";
import { CestaGeradaRepository } from '../port/out/CestaGeradaRepository';

export class EstoqueService implements EstoqueUseCase {
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly estoqueRepository: EstoqueRepository,
        private readonly acaoSocialTemplateRepository: AcaoSocialTemplateRepository,
        private readonly itemTemplateRepository: ItemTemplateRepository,
        private readonly templateRepository: TemplateRepository,
        private readonly cestaGeradaRepository: CestaGeradaRepository, 
        private readonly unitOfWork: UnitOfWorkPort
    ) {
        this.logger = logger.child({ service: "EstoqueUseCase" });
    }

    public async cadastrar(dto: CadastroEstoqueDTO): Promise<void> {
        try {
            await this.estoqueRepository.save(dto);
        } catch (e: any) {
            this.logger.error({ err: e.message }, 'Erro ao persistir ')
        }
    };

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

    public async listarLocalizacao(): Promise<LocalizacaoDTO[]> {
        return await this.estoqueRepository.findLocalizacao();
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
            const cestas: CestaGeradaEntity[] = [];
            for (const templateItem of dto.templateItens) {
                const qtdNecessarioTotal = templateItem.quantidade * dto.qtdGeracaoPossivel;
                const estoqueItens = await this.estoqueRepository.findEstoqueByItemProdutoIdAndQtdGeracaoTemplate(templateItem.itemProdutoId, qtdNecessarioTotal);
                for (const estoque of estoqueItens) {
                    estoque.dataSaida = new Date();
                    estoque.isDisponivel = false;
                    const acaoSocialTemplate = new AcaoSocialTemplateEntity(null, templateItem.quantidade, templateEntity, []);
                    await this.acaoSocialTemplateRepository.save(acaoSocialTemplate);
                    this.logger.info({idAcaoSocial: acaoSocialTemplate.id}, 'Acao social cadastrada com sucesso.');
                    const itemTemplate = new ItemTemplateEntity(null, acaoSocialTemplate, estoque);
                    await this.itemTemplateRepository.save(itemTemplate);
                    this.logger.info({idItemTemplate: itemTemplate.id} , 'Item template cadastrado com sucesso.');
                    if (dto.template.gerarCestas) {
                        const statusCesta = new StatusCestaEntity(StatusCestaEnum.CRIADA, null, []);
                        const gerarCestas = new CestaGeradaEntity(null, new Date(), templateEntity, statusCesta, []);
                        cestas.push(gerarCestas);
                    }
                }
                if (cestas.length > 0) {
                    await this.cestaGeradaRepository.saveMany(cestas);
                    this.logger.info({ QtdCestasGeradas: cestas.length, templateId: templateEntity.id, descricao: dto.template.templateDesc }, "Cestas geradas para o template informado");
                }
                await this.estoqueRepository.saveMany(estoqueItens);
            }
            await this.unitOfWork.commit();
            return new ModeloTemplateCriadoResponse(templateEntity.id!);
        } catch(e: any) {
            await this.unitOfWork.rollBack();
            if (e instanceof InternalServerErrorException) {
                throw e;
            }
            if (e instanceof UnprocessableException) {
                throw e;
            }
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.");
        }
    }
    
}