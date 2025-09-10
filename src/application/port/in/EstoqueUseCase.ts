import { CadastroEstoqueDTO } from "../../dto/CadastroEstoqueDTO";
import { EstoqueDTO } from "../../dto/EstoqueDTO";
import { ItemProdutoDTO } from "../../dto/ItemProdutoDTO";
import { LocalizacaoDTO } from "../../dto/LocalizacaoDTO";
import { UnidadeDeMedidadDTO } from "../../dto/UnidadeDeMedidaDTO";

export interface EstoqueUseCase {
    cadastrar: (dto: CadastroEstoqueDTO) => Promise<void>;
    deletar: (idAlimento: number) => Promise<void>;
    listarUnidadeMedida: () => Promise<UnidadeDeMedidadDTO[]>;
    listarLocalizacao: () => Promise<LocalizacaoDTO[]>;
    listarItemProduto: () => Promise<ItemProdutoDTO[]>;
    listarAlimentos: () => Promise<EstoqueDTO[]>;
}