import { CadastroAlimentoDTO } from "../../application/dto/CadastroAlimentoDTO";
import { ItemProdutoDTO } from "../../application/dto/ItemProdutoDTO";
import { LocalizacaoDTO } from "../../application/dto/LocalizacaoDTO";
import { UnidadeDeMedidadDTO } from "../../application/dto/UnidadeDeMedidaDTO";
import { EstoqueAlimentoEntity } from "../persistence/entities/EstoqueAlimentoEntity";
import { ItemProdutoEntity } from "../persistence/entities/ItemProdutoEntity";
import { LocalizacaoEntity } from "../persistence/entities/LocalizacaoEntity";
import { UnidadeMedidaEntity } from "../persistence/entities/UnidadeDeMedidaEntity";

export class AlimentoMapper {
    private AlimentoMapper() {}

    public static toAlimentoEntity(dto: CadastroAlimentoDTO): EstoqueAlimentoEntity {
        const teste = new UnidadeMedidaEntity(dto.idUnidadeMedida);
        return new EstoqueAlimentoEntity(
            null,
            dto.validade,
            new Date(),
            null,
            new UnidadeMedidaEntity(dto.idUnidadeMedida),
            new LocalizacaoEntity(dto.idLocalizacao),
            new ItemProdutoEntity(dto.itemProdutoId)
        );
    }

    public static toUnidadeDeMedidaDTO(iterator: UnidadeMedidaEntity[]): UnidadeDeMedidadDTO[] {
        return iterator.map(item => new UnidadeDeMedidadDTO(item.id, item.undMedidas));
    }

    public static toLocalizacaoDTO(iterator: LocalizacaoEntity[]): LocalizacaoDTO[] {
        return iterator.map(localizacao => new LocalizacaoDTO(localizacao.id, localizacao.localizacaoDesc));
    }

    public static toItemProdutoDTO(iterator: ItemProdutoEntity[]): ItemProdutoDTO[] {
        return iterator.map(itemProduto => new ItemProdutoDTO(itemProduto.id, itemProduto.itemProdutoDesc));
    }
}