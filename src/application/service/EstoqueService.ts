import { CadastroEstoqueDTO } from "../dto/CadastroEstoqueDTO";
import { ConsultaGeracaoTemplateDTO } from "../dto/ConsultaGeracaoTemplateDTO";
import { EstoqueDTO } from "../dto/EstoqueDTO";
import { ItemProdutoDTO } from "../dto/ItemProdutoDTO";
import { LocalizacaoDTO } from "../dto/LocalizacaoDTO";
import { RespostaConsultaGeracaoTemplateDTO } from "../dto/RespostaConsultaGeracaoTemplateDTO";
import { UnidadeDeMedidadDTO } from "../dto/UnidadeDeMedidaDTO";
import { EstoqueUseCase } from "../port/in/EstoqueUseCase";
import { EstoqueRepository } from "../port/out/EstoqueRepository";

export class EstoqueService implements EstoqueUseCase {
    constructor(private readonly estoqueRepository: EstoqueRepository) {}

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
    
}