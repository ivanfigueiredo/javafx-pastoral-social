import { EstoqueEntity } from "../../../adapters/persistence/entities/EstoqueEntity";
import { ItemProdutoEntity } from "../../../adapters/persistence/entities/ItemProdutoEntity";
import { CadastroEstoqueDTO } from "../../dto/CadastroEstoqueDTO";
import { EstoqueDTO } from "../../dto/EstoqueDTO";
import { ItemProdutoDTO } from "../../dto/ItemProdutoDTO";
import { TemplateItemDTO } from "../../dto/TemplateItemDTO";
import { UnidadeDeMedidadDTO } from "../../dto/UnidadeDeMedidaDTO";

export interface EstoqueRepository {
    save: (dto: CadastroEstoqueDTO) => Promise<void>;
    saveMany: (estoque: EstoqueEntity[]) => Promise<void>;
    deleteOne: (idEstoque: number) => Promise<void>;
    findUnidadeDeMedidas: () => Promise<UnidadeDeMedidadDTO[]>;
    findITemProduto: () => Promise<ItemProdutoDTO[]>;
    findItemProdutoById: (itemProdutoId: number) => Promise<ItemProdutoEntity | null>;
    findEstoqueByIdItemProduto: (idItemProduto: number) => Promise<EstoqueDTO[]>;
    consultaGeracaoTemplate: (templateItens: TemplateItemDTO[]) => Promise<number>;
    findEstoqueByItemProdutoIdAndQtdGeracaoTemplate: (itemProdutoId: number, qtdGeracaoTemplate: number) => Promise<EstoqueEntity[]>;
}