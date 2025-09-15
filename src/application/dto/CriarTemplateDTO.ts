import { TemplateTypeEnum } from "./enuns/TemplateTypeEnum";

export class CriarTemplateDTO {
    constructor(readonly templateDesc: string, readonly templateType: TemplateTypeEnum) {}
}