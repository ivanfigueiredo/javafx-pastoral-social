import { EstoqueDisponivelDTO } from "./EstoqueDisponivelDTO";

export class SugerirModeloTemplateResponseDTO {
    constructor(readonly templates: TemplateModeloFilhosDTO[]) {}
}

export class TemplateModeloFilhosDTO {
    constructor(readonly templateItens: EstoqueDisponivelDTO[]) {}
}