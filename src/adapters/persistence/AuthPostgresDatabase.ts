import { Repository } from "typeorm";
import { AuthQuery } from "../http/authentication/AuthQuery";
import { Connection } from "./database/Connection";
import { SecurityEntity } from "./entities/SecurityEntity";
import { SecurityResponseDTO } from "../../application/dto/SecurityResponseDTO";
import { AuthRepository } from "../../application/port/out/AuthRepository";
import { ValidateRefreshTokenResponseDTO } from "../../application/dto/ValidateRefreshTokenResponseDTO";
import { SecurityMapper } from "../mappers/SecurityMapper";

export class AuthPostgresDatabase implements AuthQuery, AuthRepository {
    private readonly securityRepository: Repository<SecurityEntity>;

    constructor(private readonly connection: Connection) {
        this.securityRepository = this.connection.getDataSourcer().getRepository(SecurityEntity);
    }
    
    public async authentication(token: string): Promise<SecurityResponseDTO | null> {
        const security = await this.securityRepository.createQueryBuilder('security')
            .leftJoinAndSelect('security.user', 'user')
            .leftJoinAndSelect('user.role', 'role')
            .where({ tokenHash: token })
            .getOne();
        if (security) {
            return new SecurityResponseDTO(security.user.id, security.user.role!.description, security.expiresAt, security.revoked);
        }
        return security;
    }

    public async validateRefreshToken(refreshToken: string): Promise<ValidateRefreshTokenResponseDTO | null> {
        const security = await this.securityRepository.createQueryBuilder('security')
            .leftJoinAndSelect("security.user", "user")
            .where({ tokenHash: refreshToken })
            .getOne();
        if (security) {
            return SecurityMapper.toValidateRefreshTokenResponseDTO(security);
        }
        return security;
    }
}