import { LocalizacaoEntity } from "../../../adapters/persistence/entities/LocalizacaoEntity";

export interface LocalizacaoRepository {
    countLocalizacaoDisponivel: (estante: number) => Promise<number>;
    findLocalizacao: (estante: number, limit: number) => Promise<LocalizacaoEntity[]>;
}