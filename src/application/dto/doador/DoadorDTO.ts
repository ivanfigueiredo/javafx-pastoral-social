import { BadRequestException } from "../../exceptions/BadRequestException";

export class DoadorDTO {
    constructor(readonly nomeDoador: string, readonly telefone: string) {
        if (nomeDoador === null || nomeDoador === undefined) {
            throw new BadRequestException("O campo nomeDoador é obrigatório.");
        }
        if (telefone === null || telefone === undefined) {
            throw new BadRequestException("O campo telefone é obrigatório.");
        }
    }

    public cleanTelefone(): string {
        return this.telefone.replace(/\D/g, '');
    }
}