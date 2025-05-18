import { UserResponseDTO } from "./UserResponseDTO";

export type UserRevokedToken = Omit<UserResponseDTO, "permissions">;

export class SecurityRevokedTokenDTO {
    constructor(readonly securityId: number, readonly tokenHash: string, readonly revoked: boolean, readonly expiresAt: Date) {}
}

export class RevokedTokenResponseDTO {
    constructor(readonly user: UserRevokedToken, readonly security: SecurityRevokedTokenDTO[]) {}
}