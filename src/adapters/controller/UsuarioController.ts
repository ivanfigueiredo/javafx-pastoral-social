import { NextFunction, Request, Response } from "express";
import { Auth } from "../http/authentication/Auth";
import { Authorize } from "../http/authorization/Authorize";
import { UserLogged } from "../http/types/express";
import { ActionType } from "../http/authorization/Permission";
import { HttpClient } from "../http/HttpClient";
import { UpdateUsuarioUseCase } from "../../application/port/in/UpdateUsuarioUseCase";
import { UpdateUsuarioDTO } from "../../application/dto/UpdateUsuarioDTO";

export class UsuarioController {
    constructor(
        readonly httpClient: HttpClient,
        readonly auth: Auth,
        readonly authorize: Authorize,
        readonly updateUsuarioUseCase: UpdateUsuarioUseCase
    ) {
        httpClient.on(
            "put", 
            "/usuario/update", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.AtualizarUsuario),
            async function (_params: any, data: UpdateUsuarioDTO, userLogged?: UserLogged) {
                const dto = new UpdateUsuarioDTO(data.nome, data.novaSenha, data.telefone);
                const output = await updateUsuarioUseCase.execute(dto, userLogged!.userId);
                return {
                    statusCode: 200,
                    timeStampe: new Date().toISOString(),
                    data: output ?? {}
                };
            }
        );
    }
}