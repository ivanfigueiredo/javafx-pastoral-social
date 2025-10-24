import { CancelarAjudaDTO } from "../../dto/CancelarAjudaDTO";

export interface CancelarAjudaUseCase {
    execute: (dto: CancelarAjudaDTO) => Promise<void>;
}