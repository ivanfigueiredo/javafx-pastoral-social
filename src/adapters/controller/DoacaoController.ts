import { NextFunction, Response, Request } from "express";
import { Auth } from "../http/authentication/Auth";
import { Authorize } from "../http/authorization/Authorize";
import { HttpClient } from "../http/HttpClient";
import { DoacaoUseCase } from "../../application/port/in/DoacaoUseCase";
import { CadastrarDoacaoDTO } from "../../application/dto/doador/CadastrarDoacaoDTO";
import { DoadorDTO } from "../../application/dto/doador/DoadorDTO";
import { ItemProdutoDoacaoDTO } from "../../application/dto/doador/ItemProdutoDoacaoDTO";

export class DoacaoController {
    constructor(
        readonly httpClient: HttpClient,
        readonly auth: Auth,
        readonly authorize: Authorize,
        readonly doacaoUseCase: DoacaoUseCase
    ) {
        httpClient.on(
            "post", 
            "/doacao/cadastrar", 
            // auth.authentication.bind(auth),
            // async (req: Request, res: Response, next: NextFunction) => authorize.can(req, res, next, ActionType.CadastrarItemEstoque),
            (req: Request, res: Response, next: NextFunction) => next(),
            (req: Request, res: Response, next: NextFunction) => next(),
            async function (params: any, data: CadastrarDoacaoDTO) {
                const dto = new CadastrarDoacaoDTO(
                    data.idAcao, 
                    new DoadorDTO(data.doador.nomeDoador, data.doador.telefone), 
                    data.tipoDoacao, 
                    data.itensProduto.map(item => new ItemProdutoDoacaoDTO(item.idItemProduto, item.quantidade)), 
                    data.dataEntrega);
                const output = await doacaoUseCase.cadastrarDoacao(dto);
                return {
                    statusCode: 201,
                    timeStampe: new Date().toISOString(),
                    data: output ?? {}
                };
            }
        );
    }
}