import { AcaoSocialTemplateEntity } from "../../adapters/persistence/entities/AcaoSocialTemplateEntity";
import { ItemTemplateEntity } from "../../adapters/persistence/entities/ItemTemplateEntity";
import { CadastroEstoqueDTO } from "../dto/CadastroEstoqueDTO";
import { ConsultaGeracaoTemplateDTO } from "../dto/ConsultaGeracaoTemplateDTO";
import { EstoqueDTO } from "../dto/EstoqueDTO";
import { GeracaoModeloTemplateDTO } from "../dto/GeracaoModeloTemplateDTO";
import { ItemProdutoDTO } from "../dto/ItemProdutoDTO";
import { LocalizacaoDTO } from "../dto/LocalizacaoDTO";
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

export class EstoqueService implements EstoqueUseCase {
    constructor(
        private readonly estoqueRepository: EstoqueRepository,
        private readonly acaoSocialTemplateRepository: AcaoSocialTemplateRepository,
        private readonly itemTemplateRepository: ItemTemplateRepository,
        private readonly templateRepository: TemplateRepository,
        private readonly unitOfWork: UnitOfWorkPort
    ) {}

    public async cadastrar(dto: CadastroEstoqueDTO): Promise<void> {
        try {
            await this.estoqueRepository.save(dto);
        } catch (error) {}
    };

    public async deletar(idAlimento: number): Promise<void> {
        try {
            await this.estoqueRepository.deleteOne(idAlimento);
        } catch (error) {}
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

    public async listarAlimentos(): Promise<EstoqueDTO[]> {
        return await this.estoqueRepository.findEstoque();
    }

    public async consultarGeracaoTemplate(dto: ConsultaGeracaoTemplateDTO): Promise<RespostaConsultaGeracaoTemplateDTO> {
        const result = await this.estoqueRepository.consultaGeracaoTemplate(dto.templateItens);
        return new RespostaConsultaGeracaoTemplateDTO(result);
    }

    public async gerarModeloTemplate(dto: GeracaoModeloTemplateDTO): Promise<any> {
        try {
            await this.unitOfWork.startTransaction();
            const templateEntity = await this.templateRepository.findTemplateById(dto.idTemplate);
            if (!templateEntity) {
                throw new Error("Template informado não foi encontrado.");
            }
            const consultGeracaoTemplate = new ConsultaGeracaoTemplateDTO(dto.templateItens);
            const result = await this.consultarGeracaoTemplate(consultGeracaoTemplate);
            if (result.quantidadePossivel == 0) {
                throw new UnprocessableException(`Estoque indisponível para o template: '${templateEntity.descricao}' informado.`);
            }
            for (const templateItem of dto.templateItens) {
                const qtdNecessarioTotal = templateItem.quantidade * dto.qtdGeracaoPossivel;
                const estoqueItens = await this.estoqueRepository.findEstoqueByItemProdutoIdAndQtdGeracaoTemplate(templateItem.itemProdutoId, qtdNecessarioTotal);
                for (const estoque of estoqueItens) {
                    estoque.dataSaida = new Date();
                    estoque.isDisponivel = false;
                    const acaoSocialTemplate = new AcaoSocialTemplateEntity(null, templateItem.quantidade, templateEntity, []);
                    await this.acaoSocialTemplateRepository.save(acaoSocialTemplate);
                    const itemTemplate = new ItemTemplateEntity(null, acaoSocialTemplate, estoque);
                    await this.itemTemplateRepository.save(itemTemplate);
                }
                await this.estoqueRepository.saveMany(estoqueItens);
            }
            await this.unitOfWork.commit();
            return {OK: true}
        } catch(e: any) {
            console.log(`========>>>>>>>>>>>>> ${e}`);
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