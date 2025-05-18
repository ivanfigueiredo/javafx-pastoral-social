export class AssociarFamiliaComDificuldadeDTO {
    constructor(readonly idDificuldade: number, readonly idFamilia: number, readonly outros: string | null) {}
}