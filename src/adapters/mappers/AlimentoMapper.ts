import { CadastroAlimentoDTO } from "../../application/dto/CadastroAlimentoDTO";
import { EstoqueDTO } from "../../application/dto/EstoqueDTO";
import { ItemProdutoDTO } from "../../application/dto/ItemProdutoDTO";
import { LocalizacaoDTO } from "../../application/dto/LocalizacaoDTO";
import { UnidadeDeMedidadDTO } from "../../application/dto/UnidadeDeMedidaDTO";
import { EstoqueEntity } from "../persistence/entities/EstoqueEntity";
import { ItemProdutoEntity } from "../persistence/entities/ItemProdutoEntity";
import { LocalizacaoEntity } from "../persistence/entities/LocalizacaoEntity";
import { UnidadeMedidaEntity } from "../persistence/entities/UnidadeDeMedidaEntity";

export class AlimentoMapper {
    private AlimentoMapper() {}

    public static toAlimentoEntity(dto: CadastroAlimentoDTO): EstoqueEntity {
        return new EstoqueEntity(
            null,
            new Date(),
            null,
            new LocalizacaoEntity(dto.idLocalizacao),
            new ItemProdutoEntity(dto.itemProdutoId, '', dto.validade, [], new UnidadeMedidaEntity(dto.idUnidadeMedida, '', []), []),
            []

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

    public static toEstoqueDTO(iterator: EstoqueEntity[]): EstoqueDTO[] {
        return iterator.map(estok => new EstoqueDTO(
            estok.id!, 
            estok.itemProduto.validade, 
            estok.dataEntrada, 
            estok.dataSaida, 
            new ItemProdutoDTO(estok.itemProduto.id, estok.itemProduto.itemProdutoDesc), 
            new LocalizacaoDTO(estok.localizacao.id, estok.localizacao.localizacaoDesc), 
            new UnidadeDeMedidadDTO(estok.itemProduto.unidadeMedida.id, estok.itemProduto.unidadeMedida.undMedidas))
        );
    }
}