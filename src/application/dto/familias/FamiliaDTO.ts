export class FamiliaDTO {
    constructor(
        readonly idFamilia: number,
        readonly representanteFamiliar: string,
        readonly endereco: string | null,
        readonly qtdPessoas: number | null,
        readonly qtdPessoasEmpregadas: number | null
    ) {}
}