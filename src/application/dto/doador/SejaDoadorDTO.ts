import { BadRequestException } from "../../exceptions/BadRequestException";

export class SejaDoadorDTO {
    constructor(
        readonly nomeDoador: string,
        readonly telefone: string
    ) {
        if (!nomeDoador || nomeDoador.trim() === "") {
            throw new BadRequestException("O nome do doador é obrigatório.");
        }
        if (!telefone || telefone.trim() === "") {
            throw new BadRequestException("O telefone do doador é obrigatório.");
        }
    }

    public cleanTelefone(): string {
        return this.telefone.replace(/\D/g, '');
    }
}