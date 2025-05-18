import { UserResponseDTO } from "./UserResponseDTO";

export type UserSecurity = Omit<UserResponseDTO, "permissions">;

export class ValidateRefreshTokenResponseDTO {
    constructor(readonly user: UserSecurity, readonly expiresAt: Date, readonly revoked: boolean) {}
}