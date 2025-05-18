export class CadastrarFamiliaDTO {
    constructor(
        readonly nomeRepresentante: string,
        readonly idade: number,
        readonly idComunidade: number,
        readonly idDificuldade: number,
        readonly cpfRg: string | null,
        readonly telefone: string | null,
        readonly endereco: string | null,
        readonly qtdPessoasResidencia: number | null,
        readonly qtdPessoasEmpregadas: number | null,
        readonly criancasFrequentamEscola: boolean | null,
        readonly membroComProblemaSaude: boolean | null,
        readonly jaRecebeuAjuda: boolean | null,
        readonly desejaParticiparCursos: boolean | null,
        readonly observacao: string | null,
        readonly outros: string | null
    ) {}
}