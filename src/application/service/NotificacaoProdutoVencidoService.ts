import { DataNotificationDTO } from "../dto/DataNotificationDTO";
import { NotificacaoWhatsAppGateway } from "../port/out/NotificacaoWhatsAppGateway";

export class NotificacaoProdutoVencidoService {
    constructor(private readonly notificacao: NotificacaoWhatsAppGateway) {}

    public async execute(): Promise<void> {
        const message = new DataNotificationDTO("whatsapp", "5581998399348", "template", {name: "hello_world", language: {code: 'en_US'}});
        try {
            console.log("===========================>>>>>>>>>>>>>>>>>>>>>>>>> Req " + JSON.stringify(message));
            await this.notificacao.execute(message);
            console.log("===========================>>>>>>>>>>>>>>>>>>>>>>>>> Enviou");
        } catch (e: any) {
            console.log(`==============>>>>>>>>>>>>>>>>>>>> ${JSON.stringify(e.message)}`);
        }
    }
}