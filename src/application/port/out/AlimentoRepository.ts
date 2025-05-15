import { CadastroAlimentoDTO } from "../../dto/CadastroAlimentoDTO";
import { ItemProdutoDTO } from "../../dto/ItemProdutoDTO";
import { LocalizacaoDTO } from "../../dto/LocalizacaoDTO";
import { UnidadeDeMedidadDTO } from "../../dto/UnidadeDeMedidaDTO";

export interface AlimentoRepository {
    save: (dto: CadastroAlimentoDTO) => Promise<void>;
    findUnidadeDeMedidas: () => Promise<UnidadeDeMedidadDTO[]>;
    findLocalizacao: () => Promise<LocalizacaoDTO[]>;
    findITemProduto: () => Promise<ItemProdutoDTO[]>;
}