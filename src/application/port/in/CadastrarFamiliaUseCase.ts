import { CadastrarFamiliaDTO } from "../../dto/CadastrarFamiliaDTO";

export interface CadastrarFamiliaUseCase {
    execute: (dto: CadastrarFamiliaDTO) => Promise<void>;
}