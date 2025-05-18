import { LoginDTO } from "../../dto/LoginDTO";
import { LoginResponseDTO } from "../../dto/LoginResponseDTO";
import { RefreshTokenDTO } from "../../dto/RefreshTokenDTO";
import { RefreshTokenResponseDTO } from "../../dto/RefreshTokenResponseDTO";

export interface AuthUseCase {
    login: (dto: LoginDTO) => Promise<LoginResponseDTO>;
    refreshToken: (dto: RefreshTokenDTO) => Promise<RefreshTokenResponseDTO>;
}