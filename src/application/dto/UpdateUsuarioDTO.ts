export class UpdateUsuarioDTO {
    constructor(
        readonly nome: string,
        readonly novaSenha: string,
        readonly telefone: string
    ) {}
}