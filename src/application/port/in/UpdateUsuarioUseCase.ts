import { UpdateUsuarioDTO } from "../../dto/UpdateUsuarioDTO";

export interface UpdateUsuarioUseCase {
    execute: (dto: UpdateUsuarioDTO, idUsuario: number) => Promise<void>;
}