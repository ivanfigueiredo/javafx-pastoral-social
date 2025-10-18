import { CancelarCestaDTO } from "../../dto/CancelarCestaDTO";

export interface CancelarCestaUseCase {
    execute: (dto: CancelarCestaDTO) => Promise<void>;
}