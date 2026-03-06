import { EntregarAjudaDTO } from "../../dto/ajuda/EntregarAjudaDTO";

export interface EntregarAjudaUseCase {
    execute: (dto: EntregarAjudaDTO) => Promise<void>;
}