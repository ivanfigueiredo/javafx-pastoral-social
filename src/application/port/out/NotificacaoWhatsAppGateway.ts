import { DataNotificationDTO } from "../../dto/notificacao/DataNotificationDTO";

export interface NotificacaoWhatsAppGateway {
    execute: (message: DataNotificationDTO) => Promise<void>;
}