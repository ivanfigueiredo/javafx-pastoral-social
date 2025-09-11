import { CadastroEstoqueDTO } from "../../dto/CadastroEstoqueDTO";
import { EstoqueDTO } from "../../dto/EstoqueDTO";
import { ItemProdutoDTO } from "../../dto/ItemProdutoDTO";
import { LocalizacaoDTO } from "../../dto/LocalizacaoDTO";
import { TemplateItemDTO } from "../../dto/TemplateItemDTO";
import { UnidadeDeMedidadDTO } from "../../dto/UnidadeDeMedidaDTO";

export interface EstoqueRepository {
    save: (dto: CadastroEstoqueDTO) => Promise<void>;
    deleteOne: (idAlimento: number) => Promise<void>;
    findUnidadeDeMedidas: () => Promise<UnidadeDeMedidadDTO[]>;
    findLocalizacao: () => Promise<LocalizacaoDTO[]>;
    findITemProduto: () => Promise<ItemProdutoDTO[]>;
    findEstoque: () => Promise<EstoqueDTO[]>;
    consultaGeracaoTemplate: (templateItens: TemplateItemDTO[]) => Promise<number>;
}