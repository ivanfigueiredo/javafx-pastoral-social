import { BadRequestException } from "../exceptions/BadRequestException";
import { BaseDTO } from "./BaseDTO";
import { CriarTemplateDTO } from "./CriarTemplateDTO";
import { TemplateItemDTO } from "./TemplateItemDTO";

export class GeracaoModeloTemplateDTO extends BaseDTO {
    constructor(
        readonly qtdGeracaoPossivel: number, 
        readonly template: CriarTemplateDTO,
        readonly templateItens: TemplateItemDTO[]
    ) {
        super();
        if (qtdGeracaoPossivel === null || qtdGeracaoPossivel === undefined) {
            throw new BadRequestException("O campo qtdGeracaoPossivel é obrigatório.");
        }
        if (template === null || template === undefined) {
            throw new BadRequestException("O campo template é obrigatório.");
        }
        if (templateItens === null || templateItens === undefined || templateItens.length < 0) {
            throw new BadRequestException("O campo templateItens é obrigatório.");
        }
    }
}