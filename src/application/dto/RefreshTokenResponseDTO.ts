export class RefreshTokenResponseDTO {
    constructor(readonly accessToken: string, readonly refreshToken: string) {}
}