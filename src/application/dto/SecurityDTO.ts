import { UserSecurity } from "./ValidateRefreshTokenResponseDTO";

export class SecurityDTO {
    constructor(
        readonly user: UserSecurity,
        readonly token: string, 
        readonly expiresAt: Date
    ) {}
}