import { TemplateUseCase } from "../port/in/TemplateUseCase";
import { TemplateRepository } from "../port/out/TemplateRepository";

export class TemplateService implements TemplateUseCase {
    constructor(private readonly templateRepository: TemplateRepository) {}

    public async getDetalheTemplate(templateId: number): Promise<any> {
        throw new Error("Method not implemented.");
    }

    public async listarTemplates(): Promise<any> {
        throw new Error("Method not implemented.");
    }
}