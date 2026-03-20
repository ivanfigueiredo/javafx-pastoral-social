import { BadRequestException } from "../exceptions/BadRequestException";
import { TemplateTypeEnum } from "./enuns/TemplateTypeEnum";

export class CriarTemplateDTO {
    constructor(readonly templateDesc: string, readonly templateType: TemplateTypeEnum, readonly gerarCestas?: boolean) {
        if (templateDesc === null || templateDesc === undefined) {
            throw new BadRequestException("O campo templateDesc é obrigatório.");
        }
        if (templateType === null || templateType === undefined) {
            throw new BadRequestException("O campo templateType é obrigatório.");
        }
    }
}