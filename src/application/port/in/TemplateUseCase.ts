import { CriarTemplateDTO } from "../../dto/CriarTemplateDTO";
import { TemplateCreatedDTO } from "../../dto/TemplateCreatedDTO";

export interface TemplateUseCase {
    criarTemplate(dto: CriarTemplateDTO): Promise<TemplateCreatedDTO>;
    getDetalheTemplate(templateId: number): Promise<any>;
    listarTemplates(): Promise<any>;
}