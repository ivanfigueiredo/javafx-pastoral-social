import { DataNotificationDTO } from "../../../application/dto/DataNotificationDTO";
import { NotificacaoWhatsAppGateway } from "../../../application/port/out/NotificacaoWhatsAppGateway";
import axios from 'axios';

export class NotificacaoWhatsAppGatewayImpl implements NotificacaoWhatsAppGateway {
    public async execute(message: DataNotificationDTO): Promise<void> {
        try {
            await axios.post("https://graph.facebook.com/v22.0/8915551719113/messages", message, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": ""
                }
            });
        } catch (e: any) {
            if (axios.isAxiosError(e)) {
                console.error("Erro WhatsApp:", e.response?.data || e.message);
            } else {
                console.error("Erro desconhecido:", e);
            }
            throw e;
        }
    }
}