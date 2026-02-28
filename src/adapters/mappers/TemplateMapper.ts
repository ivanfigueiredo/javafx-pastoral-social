import { OpcaoListaDTO } from "../../application/dto/OpcaoListaDTO";
import { TemplateEntity } from "../persistence/entities/TemplateEntity";

export class TemplateMapper {
    public static toTemplateOpcaoListaDTO(iterator: TemplateEntity[]): OpcaoListaDTO[] {
        return iterator.map(template => new OpcaoListaDTO(template.id!.toString(), template.descricao!));
    }
}