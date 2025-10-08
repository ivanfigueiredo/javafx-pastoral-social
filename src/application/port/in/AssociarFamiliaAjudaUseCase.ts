import { AssociarAjudaFamiliaDTO } from "../../dto/AssociarAjudaFamiliaDTO";

export interface AssociarFamiliaAjudaUseCase {
    execute: (dto: AssociarAjudaFamiliaDTO[]) => Promise<void>;
}