import { GetTemplatesDTO } from "../../dto/GetTemplatesDTO";

export interface TemplateUseCase {
    getDetalheTemplate(templateId: number): Promise<any>;
    listarTemplates(dto: GetTemplatesDTO): Promise<any>;
}