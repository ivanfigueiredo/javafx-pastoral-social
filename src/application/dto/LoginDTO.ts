import { BadRequestException } from "../exceptions/BadRequestException";

export class LoginDTO {
    constructor(readonly nickName: string, readonly senha: string) {
        if (nickName === null || nickName === undefined) {
            throw new BadRequestException("O campo nickName é obrigatório");
        }
        if (senha === null || senha === undefined) {
            throw new BadRequestException("O campo senha é obrigatório.");
        }
    }
}