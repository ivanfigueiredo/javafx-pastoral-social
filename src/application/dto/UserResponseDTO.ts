export class UserResponseDTO {
    constructor(readonly userId: number, readonly nickName: string, readonly password: string, readonly permissions: string[]) {}
}