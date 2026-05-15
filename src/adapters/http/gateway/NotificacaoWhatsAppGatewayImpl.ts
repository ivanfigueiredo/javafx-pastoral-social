import axios from 'axios';
import { DataNotificationDTO } from "../../../application/dto/notificacao/DataNotificationDTO";
import { NotificacaoWhatsAppGateway } from "../../../application/port/out/NotificacaoWhatsAppGateway";
import { Logger } from 'pino';
import { DataNotificationTemplateTextDTO } from '../../../application/dto/notificacao/DataNotificationTemplateLivreDTO';

export class NotificacaoWhatsAppGatewayImpl implements NotificacaoWhatsAppGateway {
    private readonly logger: Logger;

    public constructor(logger: Logger,) {
        this.logger = logger.child({ service: 'NotificarAgenteProdutoVencimentoService' });
    }

    public async execute(message: DataNotificationDTO): Promise<void> {
        try {
            await axios.post("https://graph.facebook.com/v22.0/966566286546764/messages", message, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.WHATSAPP_BEARER_TOKEN}`
                }
            });
        } catch (e: any) {
            if (axios.isAxiosError(e)) {
                this.logger.error({Error: JSON.stringify(e.response?.data || e.message, null, 2)});
            } else {
                this.logger.error({Error: JSON.stringify(e.message, null, 2)});
            }
        }
    }

    public async sendMessage(message: DataNotificationTemplateTextDTO): Promise<void> {
        try {
            await axios.post("https://graph.facebook.com/v22.0/966566286546764/messages", message, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.WHATSAPP_BEARER_TOKEN}`
                }
            });
        } catch (e: any) {
            if (axios.isAxiosError(e)) {
                this.logger.error({Error: JSON.stringify(e.response?.data || e.message, null, 2)});
            } else {
                this.logger.error({Error: JSON.stringify(e.message, null, 2)});
            }
        }
    }
}