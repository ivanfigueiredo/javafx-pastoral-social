import { UserResponseDTO } from "../../dto/UserResponseDTO";

export interface UserRepository {
    findUserByNickName: (nickName: string) => Promise<UserResponseDTO>;
}