import { CestaFilterQueryDTO } from "../../dto/CestaFilterQueryDTO";
import { PaginatedDTO } from "../../dto/PaginatedDTO";

export interface GetCestasUseCase {
    execute(dto: CestaFilterQueryDTO): Promise<PaginatedDTO>;
}