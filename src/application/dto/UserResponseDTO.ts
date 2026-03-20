export class UserResponseDTO {
    constructor(readonly userId: number, readonly nickName: string, readonly nome: string, readonly password: string, readonly telefone: string, readonly permissions: string[]) {}
}