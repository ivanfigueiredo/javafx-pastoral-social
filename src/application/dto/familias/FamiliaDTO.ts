import { ComunidadeDTO } from "../ComunidadeDTO";

export class FamiliaDTO {
    constructor(
        readonly idFamilia: number,
        readonly representanteFamiliar: string,
        readonly endereco: string | null,
        readonly qtdPessoas: number | null,
        readonly qtdPessoasEmpregadas: number | null,
        readonly comunidade: ComunidadeDTO | null,
        readonly dificuldades: FamiliaDificuldadeDTO[],
        readonly telefone: string | null,
        readonly criancasFrequentamEscola: boolean | null,
        readonly membroComProblemaSaude: boolean | null
    ) {}
}

export class FamiliaDificuldadeDTO {
    constructor(
        readonly idDificuldade: number,
        readonly descricao: string
    ) {}
}