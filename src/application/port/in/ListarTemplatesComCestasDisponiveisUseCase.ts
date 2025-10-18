import { ListarTemplatesComCestasDisponiveisDTO } from "../../dto/ListarTemplatesComCestasDisponiveisDTO";

export interface ListarTemplatesComCestasDisponiveisUseCase {
    execute: () => Promise<ListarTemplatesComCestasDisponiveisDTO[]>;
}