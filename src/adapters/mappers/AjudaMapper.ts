import { OpcaoListaDTO } from "../../application/dto/OpcaoListaDTO";
import { TipoAjudaEntity } from "../persistence/entities/TipoAjudaEntity";

export class AjudaMapper {
    public static toTipoAjudaOpcaoListaDTO(iterator: TipoAjudaEntity[]): OpcaoListaDTO[] {
        return iterator.map(tipoAjuda => new OpcaoListaDTO(tipoAjuda.id.toString(), tipoAjuda.descricao!));
    }
}