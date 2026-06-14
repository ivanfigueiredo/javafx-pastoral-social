import { CadastroEstoqueDTO } from "../../dto/estoque/CadastroEstoqueDTO";
import { ConsultaGeracaoTemplateDTO } from "../../dto/ConsultaGeracaoTemplateDTO";
import { TemplateTypeEnum } from "../../dto/enuns/TemplateTypeEnum";
import { CadastroEstoqueV2DTO } from "../../dto/estoque/CadastroEstoqueV2DTO";
import { EstoqueDTO } from "../../dto/estoque/EstoqueDTO";
import { GeracaoModeloTemplateDTO } from "../../dto/GeracaoModeloTemplateDTO";
import { ItemProdutoDTO } from "../../dto/ItemProdutoDTO";
import { ModeloTemplateCriadoResponse } from "../../dto/ModeloTemplateCriadoResponseDTO";
import { RespostaConsultaGeracaoTemplateDTO } from "../../dto/RespostaConsultaGeracaoTemplateDTO";
import { TemplateItemDTO } from "../../dto/TemplateItemDTO";
import { UnidadeDeMedidadDTO } from "../../dto/UnidadeDeMedidaDTO";

export interface EstoqueUseCase {
    cadastrar: (dto: CadastroEstoqueDTO) => Promise<void>;
    cadastrarV2: (dto: CadastroEstoqueV2DTO) => Promise<void>;
    deletar: (idEstoque: number) => Promise<void>;
    listarUnidadeMedida: () => Promise<UnidadeDeMedidadDTO[]>;
    listarItemProduto: () => Promise<ItemProdutoDTO[]>;
    listarEstoqueByIdItemProduto: (idItemProduto: number) => Promise<EstoqueDTO[]>;
    consultarGeracaoTemplate: (dto: ConsultaGeracaoTemplateDTO) => Promise<RespostaConsultaGeracaoTemplateDTO>;
    gerarModeloTemplate: (dto: GeracaoModeloTemplateDTO) => Promise<ModeloTemplateCriadoResponse>;
    criarModeloTemplateAcao: (templateItens: TemplateItemDTO[], templateType: TemplateTypeEnum) => Promise<any>;
    sugerirModeloTemplate: () => Promise<any>;
    removerProdutosVencidos: () => Promise<void>;
}