import { BadRequestException } from "../exceptions/BadRequestException";
import { TemplateItemDTO } from "./TemplateItemDTO";

export class ConsultaGeracaoTemplateDTO {
    constructor(readonly templateItens: TemplateItemDTO[]) {
        if (templateItens === null || templateItens === undefined || templateItens.length === 0) {
            throw new BadRequestException("O campo templateItens é obrigatório.");
        }
    }
}