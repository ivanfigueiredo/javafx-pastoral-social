import { DataNotificationDTO } from "../../../application/dto/DataNotificationDTO";
import { NotificacaoWhatsAppGateway } from "../../../application/port/out/NotificacaoWhatsAppGateway";
import axios from 'axios';

export class NotificacaoWhatsAppGatewayImpl implements NotificacaoWhatsAppGateway {
    public async execute(message: DataNotificationDTO): Promise<void> {
        try {
            await axios.post("https://graph.facebook.com/v22.0/8915551719113/messages", message, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer EAAVY5IHR7WcBPnbBQHgIG3ANuqZC5FSq0tYZB5lmPLZAwZCzOszby0EhxAmqEf7I95KgX9TVIJlqJnfiOIzGIdWgP9uPEJEzi2P6fboGfgokESHZBrDEchdohdPt8wyZAsFipbFXZBfAjVHs7QS3HKqGWuB6ZBZBDk99zpsXeHi0sKPbNxuE9ZAlnLOhmunCBY7e2veRWQo5hBIpljZCDYQVItja1PpLaUZBuOhV5b5I1bbqhBtaWPpehAhC4jvCuMpcgQZDZD"
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