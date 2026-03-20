import { WebHookContactDTO, WebHookMetaMessageDTO } from "../../dto/notificacao/webhook/WebHookMetaPayloadDTO";

export interface VisualizarProdutosProxVencimentoUseCase {
    execute: (contacts: WebHookContactDTO[], messages: WebHookMetaMessageDTO[]) => Promise<void>;
}