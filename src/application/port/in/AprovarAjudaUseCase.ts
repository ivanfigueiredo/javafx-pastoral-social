import { AprovarAjudaDTO } from "../../dto/ajuda/AprovarAjudaDTO";

export interface AprovarAjudaUseCase {
    execute: (dto: AprovarAjudaDTO) => Promise<void>;
}