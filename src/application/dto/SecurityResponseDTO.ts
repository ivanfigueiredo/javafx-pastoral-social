export class SecurityResponseDTO {
    constructor(readonly userId: number, readonly role: string, readonly expiresAt: Date, readonly revoked: boolean) {}
}