export class UpdateUsuarioDTO {
    constructor(
        readonly nickName: string,
        readonly nome: string,
        readonly novaSenha: string
    ) {}
}