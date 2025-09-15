import { TemplateTypeEnum } from "./enuns/TemplateTypeEnum";

export class TemplateCreatedDTO {
    constructor(readonly templateId: number, readonly templateDesc: string, readonly templateType: TemplateTypeEnum) {}
}