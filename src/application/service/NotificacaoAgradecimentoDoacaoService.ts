import { Logger } from "pino";
import { DataNotificationDTO } from "../dto/notificacao/DataNotificationDTO";
import { NotificacaoWhatsAppGateway } from "../port/out/NotificacaoWhatsAppGateway";
import { ComponenteDTO, ParameterDTO } from "../dto/notificacao/ComponenteDTO";
import { MensagemNotificacaoRepository } from "../port/out/MensagemNotificacaoRepository";
import { MensagemNotificacaoEnum } from "../dto/enuns/MensagemNotificacaoEnum";
import { ComponenteTypeEnum } from "../dto/notificacao/ComponenteTypeEnum";
import { TemplateDataNotificaoDTO } from "../dto/notificacao/TemplateDataNotificaoDTO";
import { NotificarDoacaoRecebidaDoadorDTO } from "../dto/doador/NotificarDoacaoRecebidaDoadorDTO";

export class NotificacaoAgradecimentoDoacaoService {
    private readonly logger: Logger;
    
    constructor(
        logger: Logger,
        private readonly notificacao: NotificacaoWhatsAppGateway,
        private readonly msgNotificacaoRepository: MensagemNotificacaoRepository
    ) {
        this.logger = logger.child({ service: 'NotificacaoAgradecimentoDoacaoService' });
    }

    public async execute(dto: NotificarDoacaoRecebidaDoadorDTO): Promise<void> {
        try {
            const msg = await this.msgNotificacaoRepository.findMensagemNotificacaoById(MensagemNotificacaoEnum.MSG_AGRADECIMENTO_DOACAO);
            if (msg) {
                const newMsg = msg!.parametrosMensagem!.replace("$1", dto.nomeDoador.split(" ")[0]);
                const parametros = JSON.parse(newMsg) as ParameterDTO[];
                const componente = new ComponenteDTO(ComponenteTypeEnum.body, parametros);
                const templateData = new TemplateDataNotificaoDTO(msg.templateName!, {code: 'pt_BR'}, [componente]);
                const message = new DataNotificationDTO("whatsapp", dto.telefoneDoador, "template", templateData);
                await this.notificacao.execute(message);
                this.logger.info("Doador notificado com sucesso");
            }
        } catch (e: any) {
            this.logger.error({error: e.message}, 'Erro ao notificar doadores');
        }
    }
}