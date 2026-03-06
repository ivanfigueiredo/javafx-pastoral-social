import { MensagemNotificacaoEntity } from "../../../adapters/persistence/entities/MensagemNotificacaoEntity";

export interface MensagemNotificacaoRepository {
    findMensagemNotificacaoById: (idMensagem: number) => Promise<MensagemNotificacaoEntity | null>;
}