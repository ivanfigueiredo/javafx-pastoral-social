import { DataNotificationDTO } from "../../dto/notificacao/DataNotificationDTO";
import { DataNotificationTemplateTextDTO } from "../../dto/notificacao/DataNotificationTemplateLivreDTO";

export interface NotificacaoWhatsAppGateway {
    execute: (message: DataNotificationDTO) => Promise<void>;
    sendMessage: (message: DataNotificationTemplateTextDTO) => Promise<void>
}