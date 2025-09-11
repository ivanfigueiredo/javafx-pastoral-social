import { compare, hash } from 'bcrypt';
import { randomUUID } from 'crypto';
import { LoginDTO } from "../dto/LoginDTO";
import { LoginResponseDTO, PermissinSecurityDTO, UserDTO } from "../dto/LoginResponseDTO";
import { RefreshTokenDTO } from "../dto/RefreshTokenDTO";
import { RefreshTokenResponseDTO } from "../dto/RefreshTokenResponseDTO";
import { AuthUseCase } from "../port/in/AuthUseCase";
import { SecurityRepository } from "../port/out/SecurityRepository";
import { UserRepository } from "../port/out/UserRepository";
import { SecurityDTO } from '../dto/SecurityDTO';
import { AuthRepository } from '../port/out/AuthRepository';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';

export class AuthService implements AuthUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly securityRepository: SecurityRepository,
        private readonly authRepository: AuthRepository
    ) {}

    public async login(dto: LoginDTO): Promise<LoginResponseDTO> {
        const user = await this.userRepository.findUserByNickName(dto.nickName);
        const passwordIsValid = await this.isSenhaValida(dto.senha, user.password);
        if (!passwordIsValid) throw new UnauthorizedException("Usuário ou senha inválidos");
        const hashAccessToken = await this.generateHash(randomUUID());
        const hashRefreshToken = await this.generateHash(randomUUID());
        const securityAccessToken = new SecurityDTO(user, hashAccessToken, this.generateAccessTokenExpiry());
        const securityRefreshToken = new SecurityDTO(user, hashRefreshToken, this.generateRefreshTokenExpiry());
        await this.securityRepository.save(securityAccessToken);
        await this.securityRepository.save(securityRefreshToken);
        return new LoginResponseDTO(new UserDTO(user.userId, user.nickName, user.permissions), new PermissinSecurityDTO(hashAccessToken, hashRefreshToken));
    }

    public async refreshToken(dto: RefreshTokenDTO): Promise<RefreshTokenResponseDTO> {
        const security = await this.authRepository.validateRefreshToken(dto.refreshToken);
        if (!security || this.isRefreshTokenExpired(security.expiresAt) || security.revoked) {
            throw new UnauthorizedException("Token inválido, expirado ou revogado");
        }
        const revokedToken = await this.securityRepository.findTokenByUserId(security.user.userId);
        await this.securityRepository.updateMany(revokedToken);
        const hashAccessToken = await this.generateHash(randomUUID());
        const hashRefreshToken = await this.generateHash(randomUUID());
        const securityAccessToken = new SecurityDTO(security.user, hashAccessToken, this.generateAccessTokenExpiry());
        const securityRefreshToken = new SecurityDTO(security.user, hashRefreshToken, this.generateRefreshTokenExpiry());
        await this.securityRepository.save(securityAccessToken);
        await this.securityRepository.save(securityRefreshToken);
        return new RefreshTokenResponseDTO(hashAccessToken, hashRefreshToken);
    }

    private async isSenhaValida(senhaInput: string, senhaActual: string): Promise<boolean> {
        return await compare(senhaInput, senhaActual);
    }

    private async generateHash(uuid: string): Promise<string> {
        const saltRounds = 12;
        return hash(uuid, saltRounds);
    }

    private generateAccessTokenExpiry(): Date {
        return new Date(Date.now() + 15 * 60 * 1000);
    }

    private generateRefreshTokenExpiry(): Date {
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    private isRefreshTokenExpired(expiresAt: Date): boolean {
        return expiresAt.getTime() < Date.now();
    }

}