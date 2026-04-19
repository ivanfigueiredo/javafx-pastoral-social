import { NextFunction, Request, Response } from "express";
import { Auth } from "../http/authentication/Auth";
import { Authorize } from "../http/authorization/Authorize";
import { HttpClient } from "../http/HttpClient";
import { ActionType } from "../http/authorization/Permission";
import { CadastrarFamiliaDTO } from "../../application/dto/CadastrarFamiliaDTO";
import { ConsultarFamiliaUseCase } from "../../application/port/in/ConsultarFamiliaUseCase";
import { UserLogged } from "../http/types/express";
import { AuditProxy } from "../../application/port/in/AuditProxy";
import { GetFamiliaUseCase } from "../../application/port/in/GetFamiliaUseCase";
import { QueryTipoAjudaDTO } from "../../application/dto/QueryTipoAjudaDTO";
import { FamiliaFilterQueryDTO } from "../../application/dto/familias/FamiliaFilterQueryDTO";
import { TipoDificuldadeEnum } from "../../application/dto/enuns/TipoDificuldadeEnum";

export class FamiliaController {
    constructor(
        readonly httpClient: HttpClient,
        readonly auth: Auth,
        readonly authorize: Authorize,
        readonly auditProxy: AuditProxy<CadastrarFamiliaDTO, any>,
        readonly consultarFamiliaUseCase: ConsultarFamiliaUseCase,
        readonly getFamiliaUseCase: GetFamiliaUseCase
    ) {

        httpClient.on(
            "post", 
            "/familia/cadastrar", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.CadastrarFamilia),
            async function (params: any, data: CadastrarFamiliaDTO, userLogged?: UserLogged) {
                const dto = new CadastrarFamiliaDTO(
                    data.nomeRepresentante,
                    data.idade,
                    data.idComunidade,
                    data.dificuldades,
                    data.cpfRg,
                    data.telefone,
                    data.endereco,
                    data.qtdPessoasResidencia,
                    data.qtdPessoasEmpregadas,
                    data.criancasFrequentamEscola,
                    data.membroComProblemaSaude,
                    data.jaRecebeuAjuda,
                    data.desejaParticiparCursos,
                    data.observacao,
                    data.outros
                );
                const output = await auditProxy.execute(dto, ActionType.CadastrarFamilia, userLogged!);
                return {
                    statusCode: 201,
                    timeStampe: new Date().toISOString(),
                    data: output ?? {}
                };
            }
        );

        httpClient.on(
            "get", 
            "/dificuldade/listar", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ListarDificuldade),
            async function (_params: any, _data: any) {
                const output = await consultarFamiliaUseCase.listarDificuldades();
                return {
                    statusCode: 200,
                    timeStampe: new Date().toISOString(),
                    data: output
                };
            }
        );

        httpClient.on(
            "get", 
            "/comunidade/listar", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ListarComunidades),
            async function (_params: any, _data: any) {
                const output = await getFamiliaUseCase.listarComunidade();;
                return {
                    statusCode: 200,
                    timeStampe: new Date().toISOString(),
                    data: output
                };
            }
        );

        httpClient.on(
            "get", 
            "/familia/listar", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ListarFamilia),
            async function (_params: any, _data: any, __userLogged?: UserLogged, query?: any) {
                const tipoDificuldade = (query && (query.tipoDificuldade !== null && query.tipoDificuldade !== undefined)) ? TipoDificuldadeEnum[FamiliaController.removerAcentos(query.tipoDificuldade) as keyof typeof TipoDificuldadeEnum] : undefined;
                const dto = new FamiliaFilterQueryDTO(query?.page ?? 1, query?.pageSize ?? 10, tipoDificuldade, query?.dataInicio, query?.dataFim);
                const output = await getFamiliaUseCase.listarFamilias(dto);
                return {
                    statusCode: 200,
                    timeStampe: new Date().toISOString(),
                    data: output
                };
            }
        );

        httpClient.on(
            "get", 
            "/familia/opcao-lista", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ListarFamilia),
            async function (_params: any, _data: any) {
                const output = await getFamiliaUseCase.listarFamiliaOpcaoLista();
                return {
                    statusCode: 200,
                    timeStampe: new Date().toISOString(),
                    data: output
                };
            }
        );

        httpClient.on(
            "get", 
            "/familia/consulta-familia-prioridade", 
            auth.authentication.bind(auth),
            async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.ListarFamilia),
            async function (_params: any, _data: any, userLogged?: UserLogged, query?: QueryTipoAjudaDTO) {
                const output = await getFamiliaUseCase.consultarFamiliaPrioridade(query!.tipoAjuda);
                return {
                    statusCode: 200,
                    timeStampe: new Date().toISOString(),
                    data: output ?? {}
                };
            }
        );
    }

    public static removerAcentos(palavra: string): string {
        return palavra
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }
}