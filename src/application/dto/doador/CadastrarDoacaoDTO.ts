import { TipoDoacaoEnum } from "../../../adapters/persistence/entities/TipoDoacaoEnum";
import { DoadorDTO } from "./DoadorDTO";
import { ItemProdutoDoacaoDTO } from "./ItemProdutoDoacaoDTO";

export class CadastrarDoacaoDTO {
    constructor(readonly idAcao: string, readonly doador: DoadorDTO, readonly tipoDoacao: TipoDoacaoEnum, readonly itensProduto: ItemProdutoDoacaoDTO[], readonly dataEntrega: Date) {}
}