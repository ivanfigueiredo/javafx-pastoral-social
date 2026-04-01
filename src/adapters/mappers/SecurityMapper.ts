import { SecurityDTO } from "../../application/dto/SecurityDTO";
import { UserResponseDTO } from "../../application/dto/UserResponseDTO";
import { ValidateRefreshTokenResponseDTO } from "../../application/dto/ValidateRefreshTokenResponseDTO";
import { SecurityEntity } from "../persistence/entities/SecurityEntity";
import { UserEntity } from "../persistence/entities/UserEntity";
import { RevokedTokenResponseDTO } from "../../application/dto/RevokedTokenResponseDTO";

export class SecurityMapper {
    private constructor() {}

    public static toUserResponseDTO(user: UserEntity): UserResponseDTO {
        return new UserResponseDTO(
            user.id, 
            user.nickName,
            user.nome,
            user.password,
            user.telefone!,
            user.role!.rolePermissions.map(roleP => roleP.permission.action)
        );
    }

    public static toSecurityEntity(dto: SecurityDTO): SecurityEntity {
        return new SecurityEntity(
            null,
            dto.token,
            dto.expiresAt,
            false,
            new UserEntity(dto.user.userId, dto.user.nickName, dto.user.nome, dto.user.password, null, null, null, [], []),
            new Date()
        );
    }

    public static toValidateRefreshTokenResponseDTO(security: SecurityEntity): ValidateRefreshTokenResponseDTO {
        return new ValidateRefreshTokenResponseDTO(
            {userId: security.user.id, nickName: security.user.nickName, nome: security.user.nome, password: security.user.password, telefone: security.user.telefone!},
            security.expiresAt,
            security.revoked
        );
    }

    public static toRevokedToken(dto: RevokedTokenResponseDTO): SecurityEntity[] {
        return dto.security.map(sec => new SecurityEntity(
            sec.securityId,
            sec.tokenHash,
            sec.expiresAt,
            true,
            new UserEntity(dto.user.userId, dto.user.nickName, dto.user.nome, dto.user.password, null, null, null, [], [])
        ));
    }
}