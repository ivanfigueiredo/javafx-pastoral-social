import { BadRequestException } from "../exceptions/BadRequestException";
import { TipoAcaoEnum } from "./enuns/TipoAcaoEnum";
import { TemplateItemDTO } from "./TemplateItemDTO";

export class CadastrarAcaoDTO {
    constructor(
        readonly titulo: string,
        readonly descricao: string,
        readonly dataEvento: string,
        readonly inicioAcao: string,
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
        if (inicioAcao === null || inicioAcao === undefined) {
            throw new BadRequestException("O campo inicioAcao é obrigatório.");
        }
        if (tipoAcao === null || tipoAcao === undefined) {
            throw new BadRequestException("O campo tipoAcao é obrigatório.");
        }
        this.validarData(inicioAcao, new Date(), "O campo inicioAcao deve ser maior que a data atual.");
        this.validarData(dataEvento, new Date(inicioAcao), "O campo dataEvento deve ser maior que inicioAcao.");
    }

    private validarData(dataString: string, dataComparacao: Date, mensagemComparacao: string): void {
        const data = new Date(dataString);
        dataComparacao.setHours(0, 0, 0, 0);
        if (isNaN(data.getTime())) throw new BadRequestException(mensagemComparacao);
        data.setHours(0, 0, 0, 0);
        if (data <= dataComparacao) throw new BadRequestException(mensagemComparacao);
    }
}
