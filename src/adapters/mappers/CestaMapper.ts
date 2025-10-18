import { ListarTemplatesComCestasDisponiveisDTO } from "../../application/dto/ListarTemplatesComCestasDisponiveisDTO";
import { CestaGeradaEntity } from "../persistence/entities/CestaGeradaEntity";

export class CestaMapper {
    private CestaMapper() {}

    public static toDTO(cestas: CestaGeradaEntity[]): ListarTemplatesComCestasDisponiveisDTO[] {
        return cestas.map()
    }
}