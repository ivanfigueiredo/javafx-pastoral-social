import { TemplateEntity } from "../../../adapters/persistence/entities/TemplateEntity";

export interface TemplateRepository {
    findTemplateById: (templateId: number) => Promise<TemplateEntity | null>;
}