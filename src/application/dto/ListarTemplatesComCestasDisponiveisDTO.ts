export class ListarTemplatesComCestasDisponiveisDTO {
    constructor(
        readonly idTemplate: number, 
        readonly templateDescricao: string,
        readonly templateTyipo: string,
        readonly qtdCestasDisponiveis: number
    ) {}
}