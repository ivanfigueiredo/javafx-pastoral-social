import { CriarTemplateDTO } from "../../dto/CriarTemplateDTO";
import { TemplateCreatedDTO } from "../../dto/TemplateCreatedDTO";

export interface TemplateUseCase {
    getDetalheTemplate(templateId: number): Promise<any>;
    listarTemplates(): Promise<any>;
}