import { CestaFilterQueryDTO } from "../../dto/CestaFilterQueryDTO";

export interface GetCestasUseCase {
    execute(dto: CestaFilterQueryDTO): Promise<any>;
}