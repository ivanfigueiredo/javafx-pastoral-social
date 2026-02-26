export class DoadorDTO {
    constructor(readonly nomeDoador: string, readonly telefone: string) {}

    public cleanTelefone(): string {
        return this.telefone.replace(/\D/g, '');
    }
}