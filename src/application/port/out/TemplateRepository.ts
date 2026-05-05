import { TemplateEntity } from "../../../adapters/persistence/entities/TemplateEntity";
import { CriarTemplateDTO } from "../../dto/CriarTemplateDTO";
import { TemplateTypeEnum } from "../../dto/enuns/TemplateTypeEnum";
import { OpcaoListaDTO } from "../../dto/OpcaoListaDTO";

export interface TemplateRepository {
    save: (dto: CriarTemplateDTO) => Promise<TemplateEntity>;
    findTemplateById: (templateId: number) => Promise<TemplateEntity | null>;
    findPaginatedTemplate: (page: number, pageSize: number, templateType: TemplateTypeEnum) => Promise<[TemplateEntity[], number]>;
    findTemplates: () => Promise<TemplateEntity[]>;
    findTemplatesOpcaoLista: () => Promise<OpcaoListaDTO[]>;
}

