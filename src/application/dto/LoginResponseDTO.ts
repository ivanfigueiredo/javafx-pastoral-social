export class PermissinSecurityDTO {
    constructor(readonly accessToken: string, readonly refreshToken: string) {}
}

export class UserDTO {
    constructor(readonly userId: number, readonly nickName: string, readonly permissions: string[]) {}
}

export class LoginResponseDTO {
    constructor(readonly user: UserDTO, readonly security: PermissinSecurityDTO) {}
}