import { TemplateItemDTO } from "./TemplateItemDTO";

export class GeracaoModeloTemplateDTO {
    constructor(readonly idTemplate: number, readonly qtdGeracaoPossivel: number, readonly templateItens: TemplateItemDTO[]) {}
}