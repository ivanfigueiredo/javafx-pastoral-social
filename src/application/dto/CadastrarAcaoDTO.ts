import { BadRequestException } from "../exceptions/BadRequestException";
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
    ) {
        if (titulo === null || titulo === undefined) {
            throw new BadRequestException("O campo titulo é obrigatório.");
        }
        if (descricao === null || descricao === undefined) {
            throw new BadRequestException("O campo descricao é obrigatório.");
        }
        if (dataEvento === null || dataEvento === undefined) {
            throw new BadRequestException("O campo dataEvento é obrigatório.");
        }
        if (tipoAcao === null || tipoAcao === undefined) {
            throw new BadRequestException("O campo tipoAcao é obrigatório.");
        }
    }
}
