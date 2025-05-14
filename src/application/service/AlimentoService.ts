import { CadastroAlimentoDTO } from "../dto/CadastroAlimentoDTO";
import { ItemProdutoDTO } from "../dto/ItemProdutoDTO";
import { LocalizacaoDTO } from "../dto/LocalizacaoDTO";
import { UnidadeDeMedidadDTO } from "../dto/UnidadeDeMedidaDTO";
import { AlimentoUseCase } from "../port/in/AlimentoUseCase";
import { AlimentoRepository } from "../port/out/AlimentoRepository";

export class AlimentoService implements AlimentoUseCase {
    constructor(private readonly alimentoRepository: AlimentoRepository) {}

    public async cadastrar(dto: CadastroAlimentoDTO): Promise<void> {
        try {
            await this.alimentoRepository.save(dto);
        } catch (error) {}
    };

    public async listarUnidadeMedida(): Promise<UnidadeDeMedidadDTO[]> {
        return await this.alimentoRepository.findUnidadeDeMedidas();
    }

    public async listarLocalizacao(): Promise<LocalizacaoDTO[]> {
        return await this.alimentoRepository.findLocalizacao();
    }

    public async listarItemProduto(): Promise<ItemProdutoDTO[]> {
        return await this.alimentoRepository.findITemProduto();
    }

    public async listarAlimentos(): Promise<string[]> {
        return [""]
    }
    
}