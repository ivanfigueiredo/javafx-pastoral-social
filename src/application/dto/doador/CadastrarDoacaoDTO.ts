import { TipoDoacaoEnum } from "../../../adapters/persistence/entities/TipoDoacaoEnum";
import { BadRequestException } from "../../exceptions/BadRequestException";
import { DoadorDTO } from "./DoadorDTO";
import { ItemProdutoDoacaoDTO } from "./ItemProdutoDoacaoDTO";

export class CadastrarDoacaoDTO {
    constructor(
        readonly idAcao: string, 
        readonly doador: DoadorDTO, 
        readonly tipoDoacao: TipoDoacaoEnum, 
        readonly itensProduto: ItemProdutoDoacaoDTO[], 
        readonly dataEntrega: Date
    ) {
        if (idAcao === null || idAcao === undefined) {
            throw new BadRequestException("O campo idAcao é obrigatório.");
        }
        if (doador === null || doador === undefined) {
            throw new BadRequestException("O campo doador é obrigatório.");
        }
        if (tipoDoacao === null || tipoDoacao === undefined) {
            throw new BadRequestException("O campo tipoDoacao é obrigatório.");
        }
        if (dataEntrega === null || dataEntrega === undefined) {
            throw new BadRequestException("O campo dataEntrega é obrigatório.");
        }
    }
}