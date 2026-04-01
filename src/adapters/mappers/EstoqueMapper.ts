import { CadastroEstoqueDTO } from "../../application/dto/CadastroEstoqueDTO";
import { EstoqueDTO } from "../../application/dto/EstoqueDTO";
import { ItemProdutoDTO } from "../../application/dto/ItemProdutoDTO";
import { UnidadeDeMedidadDTO } from "../../application/dto/UnidadeDeMedidaDTO";
import { EstoqueEntity } from "../persistence/entities/EstoqueEntity";
import { ItemProdutoEntity } from "../persistence/entities/ItemProdutoEntity";
import { UnidadeMedidaEntity } from "../persistence/entities/UnidadeDeMedidaEntity";

export class EstoqueMapper {
    private constructor() {}

    public static toEstoqueEntity(dto: CadastroEstoqueDTO): EstoqueEntity {
        return new EstoqueEntity(
            null,
            new Date(),
            dto.validade,
            true,
            null,
            new ItemProdutoEntity(dto.itemProdutoId, null, null, null, [], []),
            null,
            [],
            dto.codProduto
        );
    }

    public static toUnidadeDeMedidaDTO(iterator: UnidadeMedidaEntity[]): UnidadeDeMedidadDTO[] {
        return iterator.map(item => new UnidadeDeMedidadDTO(item.id, item.undMedidas!))
            .sort((a, b) => a.idUnidadeDeMedida - b.idUnidadeDeMedida);
    }

    public static toItemProdutoDTO(iterator: ItemProdutoEntity[]): ItemProdutoDTO[] {
        return iterator.map(itemProduto => {
            const qtdDisponivelEstoque = itemProduto.estoques.map(estok => estok.isDisponivel ? estok : null)
                .filter(item => item != null)
                .length;
            return new ItemProdutoDTO(
                itemProduto.id, 
                itemProduto.itemProdutoDesc!, 
                qtdDisponivelEstoque
            )
        })
        .sort((a, b) => a.idItemProduto - b.idItemProduto);
    }

    public static toEstoqueDTO(iterator: EstoqueEntity[]): EstoqueDTO[] {
        return iterator.map(estok => new EstoqueDTO(
            estok.id!, 
            estok.validade,
            estok.codProduto!,
            estok.itemProduto.valorMedida!,
            estok.dataEntrada, 
            estok.dataSaida, 
            new UnidadeDeMedidadDTO(estok.itemProduto.unidadeMedida!.id, estok.itemProduto.unidadeMedida!.undMedidas!))
        );
    }
}