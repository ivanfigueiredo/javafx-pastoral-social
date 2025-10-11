import { DataNotificationDTO } from "../../dto/DataNotificationDTO";

export interface NotificacaoWhatsAppGateway {
    execute: (message: DataNotificationDTO) => Promise<void>;
}