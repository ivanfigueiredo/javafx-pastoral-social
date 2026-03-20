import { UserEntity } from "../../../adapters/persistence/entities/UserEntity";
import { UserResponseDTO } from "../../dto/UserResponseDTO";

export interface UsuarioRepository {
    findUserByNickName: (nickName: string) => Promise<UserResponseDTO>;
    findUsuarioById: (idUsuario: number) => Promise<UserEntity>;
    findAllCoordenadores: () => Promise<UserEntity[]>;
    findByTelefone: (telefone: string) => Promise<UserEntity | null>;
    save: (usuario: UserEntity) => Promise<void>;
}