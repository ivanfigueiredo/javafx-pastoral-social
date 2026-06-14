import { BadRequestException } from "../../exceptions/BadRequestException";

export class AtualizarAcaoDTO {
    constructor(
        readonly idAcao: string,
        readonly titulo?: string,
        readonly descricao?: string,
        readonly dataEvento?: string,
        readonly inicioAcao?: string
    ) {
        if (dataEvento && inicioAcao) {
            this.validarData(inicioAcao, new Date(), "O campo inicioAcao deve ser maior que a data atual.");
            this.validarData(dataEvento, new Date(inicioAcao + 'T00:00:00'), "O campo dataEvento deve ser maior que inicioAcao.");
        } else if (dataEvento && !inicioAcao) {
            this.validarData(dataEvento, new Date(), "O campo dataEvento deve ser maior que a data atual.");
        } else if (!dataEvento && inicioAcao) {
            this.validarData(inicioAcao, new Date(), "O campo inicioAcao deve ser maior que a data atual.");
        }
    }

    private validarData(dataString: string, dataComparacao: Date, mensagemComparacao: string): void {
        const data = new Date(dataString + 'T00:00:00');
        dataComparacao.setHours(0, 0, 0, 0);
        if (isNaN(data.getTime())) throw new BadRequestException(mensagemComparacao);
        data.setHours(0, 0, 0, 0);
        if (data <= dataComparacao) throw new BadRequestException(mensagemComparacao);
    }
}