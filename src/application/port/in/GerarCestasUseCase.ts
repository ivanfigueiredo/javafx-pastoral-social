import { GerarCestasDTO } from "../../dto/GerarCestasDTO";

export interface GerarCestasUseCase {
    execute: (dto: GerarCestasDTO) => Promise<void>; 
}