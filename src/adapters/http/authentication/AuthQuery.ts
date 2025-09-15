import { SecurityResponseDTO } from "../../../application/dto/SecurityResponseDTO";
import { UserEntity } from "../../persistence/entities/UserEntity";

export interface AuthQuery {
    authentication: (accessToken: string) => Promise<SecurityResponseDTO | null>;
    userInfo: (userId: number) => Promise<UserEntity | null>;
}