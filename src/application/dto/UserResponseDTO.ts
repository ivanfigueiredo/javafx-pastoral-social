export class UserResponseDTO {
    constructor(readonly userId: number, readonly nickName: string, readonly nome: string, readonly password: string, readonly permissions: string[]) {}
}