import { GetTemplatesDTO } from "../../dto/GetTemplatesDTO";
import { OpcaoListaDTO } from "../../dto/OpcaoListaDTO";

export interface TemplateUseCase {
    getDetalheTemplate(templateId: number): Promise<any>;
    listarTemplates(dto: GetTemplatesDTO): Promise<any>;
    listarTemplatesOpcaoLista(): Promise<OpcaoListaDTO[]>;
}