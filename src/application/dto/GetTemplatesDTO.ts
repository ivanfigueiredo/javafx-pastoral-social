import { TemplateTypeEnum } from "./enuns/TemplateTypeEnum";

export class GetTemplatesDTO {
    constructor(readonly page: number, readonly pageSize: number, readonly tipoTemplate: TemplateTypeEnum) {}
}