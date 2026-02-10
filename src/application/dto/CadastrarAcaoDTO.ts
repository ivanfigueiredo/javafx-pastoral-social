import { TipoAcaoEnum } from "./enuns/TipoAcaoEnum";
import { TemplateItemDTO } from "./TemplateItemDTO";

export class CadastrarAcaoDTO {
    constructor(
        readonly titulo: string,
        readonly descricao: string,
        readonly dataEvento: string,
        readonly tipoAcao: TipoAcaoEnum,
        readonly itens?: TemplateItemDTO[],
        readonly qtdAcaoSocial?: number
    ) {}
}
