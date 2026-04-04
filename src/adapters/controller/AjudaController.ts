import { NextFunction, Request, Response } from "express";
import { AjudaDTO, AssociarAjudaFamiliaDTO } from "../../application/dto/AssociarAjudaFamiliaDTO";
import { Auth } from "../http/authentication/Auth";
import { Authorize } from "../http/authorization/Authorize";
import { HttpClient } from "../http/HttpClient";
import { ActionType } from "../http/authorization/Permission";
import { UserLogged } from "../http/types/express";
import { AssociarFamiliaAjudaUseCase } from "../../application/port/in/AssociarFamiliaAjudaUseCase";
import { CancelarAjudaDTO } from "../../application/dto/CancelarAjudaDTO";
import { CancelarAjudaUseCase } from "../../application/port/in/CancelarAjudaUseCase";
import { AjudaFilterQueryDTO } from "../../application/dto/AjudaFilterQueryDTO";
import { StatusAjudaEnum } from "../persistence/entities/StatusAjudaEnum";
import { ListarAjudasUseCase } from "../../application/port/in/ListarAjudasUseCase";
import { AprovarAjudaUseCase } from "../../application/port/in/AprovarAjudaUseCase";
import { AprovarAjudaDTO } from "../../application/dto/ajuda/AprovarAjudaDTO";
import { EntregarAjudaUseCase } from "../../application/port/in/EntregarAjudaUseCase";
import { EntregarAjudaDTO } from "../../application/dto/ajuda/EntregarAjudaDTO";
import { TipoAjudaEnum } from "../../application/dto/enuns/TipoAjudaEnum";

export class AjudaController {
    constructor(
        readonly httpClient: HttpClient,
        readonly auth: Auth,
        readonly authorize: Authorize,
        readonly associarFamiliaAjudaUseCase: AssociarFamiliaAjudaUseCase,
        readonly cancelarAjudaUseCase: CancelarAjudaUseCase,
        readonly listarAjudasUseCase: ListarAjudasUseCase,
        readonly aprovarAjudaUseCase: AprovarAjudaUseCase,
        readonly entregarAjudaUseCase: EntregarAjudaUseCase
    ) {
        httpClient.on(
            "post", 
            "/ajuda/associar-familia", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.AssociarFamiliaAjuda),
            async function (params: any, data: AssociarAjudaFamiliaDTO[], userLogged?: UserLogged) {
                const dto = data.map(item => new AssociarAjudaFamiliaDTO(
                    item.idFamilia, 
                    new AjudaDTO(
                        item.ajuda.tipoAjuda as TipoAjudaEnum, 
                        item.ajuda.observacao, 
                        item.ajuda.idTemplate
                    )
                ));
                const output = await associarFamiliaAjudaUseCase.execute(dto);
                return {
                    statusCode: 201,
                    timeStampe: new Date().toISOString(),
                    data: output ?? {}
                };
            }
        );

        httpClient.on(
            "post", 
            "/ajuda/cancelar", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.CancelarAjuda),
            async function (params: any, data: CancelarAjudaDTO, userLogged?: UserLogged) {
                const dto = new CancelarAjudaDTO(data.idAjuda);
                const output = await cancelarAjudaUseCase.execute(dto);
                return {
                    statusCode: 201,
                    timeStampe: new Date().toISOString(),
                    data: output ?? {}
                };
            }
        );

        httpClient.on(
            "post", 
            "/ajuda/aprovar", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.AprovarEntrega),
            async function (params: any, data: AprovarAjudaDTO, userLogged?: UserLogged) {
                const dto = new AprovarAjudaDTO(data.idAjuda);
                const output = await aprovarAjudaUseCase.execute(dto);
                return {
                    statusCode: 201,
                    timeStampe: new Date().toISOString(),
                    data: output ?? {}
                };
            }
        );

        httpClient.on(
            "post", 
            "/ajuda/entregar", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.EntregarAjuda),
            async function (params: any, data: EntregarAjudaDTO, userLogged?: UserLogged) {
                const dto = new EntregarAjudaDTO(data.idAjuda);
                const output = await entregarAjudaUseCase.execute(dto);
                return {
                    statusCode: 201,
                    timeStampe: new Date().toISOString(),
                    data: output ?? {}
                };
            }
        );

        httpClient.on(
            "get", 
            "/ajuda/listar", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ListarAjuda),
            async function (_params: any, _data: any, _userLogged?: UserLogged, query?: any) {
                const statusAjuda = (query && query.statusAjuda !== null && query.statusAjuda !== undefined) ?
                    StatusAjudaEnum[query.statusAjuda.toUpperCase() as keyof typeof StatusAjudaEnum] : StatusAjudaEnum.AGUARDANDO_APROVACAO;
                const tipoAjuda = (query && query.tipoAjuda !== null && query.tipoAjuda !== undefined) ?
                    TipoAjudaEnum[query.tipoAjuda.toUpperCase() as keyof typeof TipoAjudaEnum] : undefined;
                const dtoQuery = new AjudaFilterQueryDTO(query?.page ?? 1, query?.pageSize ?? 10, statusAjuda, tipoAjuda);
                const output = await listarAjudasUseCase.listarAjudas(dtoQuery);
                return {
                    statusCode: 201,
                    timeStampe: new Date().toISOString(),
                    data: output ?? {}
                };
            }
        );

        httpClient.on(
            "get", 
            "/ajuda/opcao-lista", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ListarAjuda),
            async function (_params: any, _data: any, _userLogged?: UserLogged) {
                const output = await listarAjudasUseCase.listarAjudasOpcaoLista();
                return {
                    statusCode: 201,
                    timeStampe: new Date().toISOString(),
                    data: output ?? {}
                };
            }
        );
    }
}