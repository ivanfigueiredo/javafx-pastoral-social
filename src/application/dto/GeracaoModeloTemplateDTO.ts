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
    }
}