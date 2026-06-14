import { CadastrarFamiliaDTO } from "../../dto/familias/CadastrarFamiliaDTO";
import { CadastrarFamiliaV2DTO } from "../../dto/familias/CadastrarFamiliaV2DTO";

export interface CadastrarFamiliaUseCase {
    execute: (dto: CadastrarFamiliaDTO) => Promise<void>;
    executeV2: (dto: CadastrarFamiliaV2DTO) => Promise<void>;
}