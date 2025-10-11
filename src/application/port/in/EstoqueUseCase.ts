import { CadastroEstoqueDTO } from "../../dto/CadastroEstoqueDTO";
import { ConsultaGeracaoTemplateDTO } from "../../dto/ConsultaGeracaoTemplateDTO";
import { EstoqueDTO } from "../../dto/EstoqueDTO";
import { GeracaoModeloTemplateDTO } from "../../dto/GeracaoModeloTemplateDTO";
import { ItemProdutoDTO } from "../../dto/ItemProdutoDTO";
import { LocalizacaoDTO } from "../../dto/LocalizacaoDTO";
import { ModeloTemplateCriadoResponse } from "../../dto/ModeloTemplateCriadoResponseDTO";
import { RespostaConsultaGeracaoTemplateDTO } from "../../dto/RespostaConsultaGeracaoTemplateDTO";
import { UnidadeDeMedidadDTO } from "../../dto/UnidadeDeMedidaDTO";

export interface EstoqueUseCase {
    cadastrar: (dto: CadastroEstoqueDTO) => Promise<void>;
    deletar: (idEstoque: number) => Promise<void>;
    listarUnidadeMedida: () => Promise<UnidadeDeMedidadDTO[]>;
    listarLocalizacao: () => Promise<LocalizacaoDTO[]>;
    listarItemProduto: () => Promise<ItemProdutoDTO[]>;
    listarEstoqueByIdItemProduto: (idItemProduto: number) => Promise<EstoqueDTO[]>;
    consultarGeracaoTemplate: (dto: ConsultaGeracaoTemplateDTO) => Promise<RespostaConsultaGeracaoTemplateDTO>;
    gerarModeloTemplate: (dto: GeracaoModeloTemplateDTO) => Promise<ModeloTemplateCriadoResponse>;
}