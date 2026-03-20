import { BadRequestException } from "../exceptions/BadRequestException";

export class RefreshTokenDTO {
    constructor(readonly refreshToken: string) {
        if (refreshToken === null || refreshToken === undefined) {
            throw new BadRequestException("O campo refreshToken é obrigatório.");
        }
    }
}