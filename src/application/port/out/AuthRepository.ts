import { ValidateRefreshTokenResponseDTO } from "../../dto/ValidateRefreshTokenResponseDTO";

export interface AuthRepository {
    validateRefreshToken: (refreshToken: string) => Promise<ValidateRefreshTokenResponseDTO | null>;
}