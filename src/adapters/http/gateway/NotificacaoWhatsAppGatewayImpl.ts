import { DataNotificationDTO } from "../../../application/dto/notificacao/DataNotificationDTO";
import { NotificacaoWhatsAppGateway } from "../../../application/port/out/NotificacaoWhatsAppGateway";
import axios from 'axios';

export class NotificacaoWhatsAppGatewayImpl implements NotificacaoWhatsAppGateway {
    public async execute(message: DataNotificationDTO): Promise<void> {
        try {
            await axios.post("https://graph.facebook.com/v22.0/966566286546764/messages", message, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer EAAVY5IHR7WcBQy5gZAEJn7lufyDycT4lzrZA6kZAqs2sZAWDT8MkFcIsh83YGjVD4ZCKCJT5bwLvVZCZCKbXqRl65XhAC779V9Us8EhSpSzfHPxkztC5amPsU4QPABCpJMTMZBykwy1FQ6Oud5ut2T72xwXg8dKSFj3k12FBsji47Y4ZAKR86ey2G4UlYH1d6GcnJo4ZAKfCrVlOMkAGCKbiSmOGWoeMjdaI7jgPH1VHnARerpxOkOA0PNqDaIdHggGXKZBfw6YW0F2HoUkFrUgTBNUgHIokqvYOMJ6G7fEpgZDZD"
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