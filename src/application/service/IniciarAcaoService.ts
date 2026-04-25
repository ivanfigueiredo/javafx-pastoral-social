import { Logger } from "pino";
import { IniciarAcaoUseCase } from "../port/in/IniciarAcaoUseCase";
import { AcaoRepository } from "../port/out/AcaoRepository";
import { StatusAcaoEnum } from "../dto/enuns/StatusAcaoEnum";
import { MensagemNotificacaoRepository } from "../port/out/MensagemNotificacaoRepository";
import { MensagemNotificacaoEnum } from "../dto/enuns/MensagemNotificacaoEnum";
import { DoadorRepository } from "../port/out/DoadorRepository";
import { ParameterDTO, ComponenteDTO } from "../dto/notificacao/ComponenteDTO";
import { ComponenteTypeEnum } from "../dto/notificacao/ComponenteTypeEnum";
import { DataNotificationDTO } from "../dto/notificacao/DataNotificationDTO";
import { TemplateDataNotificaoDTO } from "../dto/notificacao/TemplateDataNotificaoDTO";
import { NotificacaoWhatsAppGateway } from "../port/out/NotificacaoWhatsAppGateway";

export class IniciarAcaoService implements IniciarAcaoUseCase {
    private readonly logger: Logger;
    
    public constructor(
        logger: Logger,
        private readonly acaoRepository: AcaoRepository,
        private readonly msgNotificacaoRepository: MensagemNotificacaoRepository,
        private readonly doadorRepository: DoadorRepository,
        private readonly notificacao: NotificacaoWhatsAppGateway
    ) {
        this.logger = logger.child({ service: 'IniciarAcaoUseCase' });
    }

    public async execute(): Promise<void> {
        try {
            const acao = await this.acaoRepository.findByInicioAcao();
            if (acao) {
                const msg = await this.msgNotificacaoRepository.findMensagemNotificacaoById(MensagemNotificacaoEnum.MSG_ACAO_ATIVA);
                if (msg) {
                    this.logger.info(`Ação ${acao.titulo} iniciada.`);
                    const doadores = await this.doadorRepository.findDoadoresAll();
                    for (const doador of doadores) {
                        const URL_ACAO = 'https://andersonaslap.github.io/deferred-deep-link-pastoral-social?doadorDetalheAcao/$slug';
                        const newMsg = msg.parametrosMensagem!.replace("$1", doador.doadorNome!).replace("$2", URL_ACAO.replace("$slug", `${acao.acaoId!}`));
                        const parametros = JSON.parse(newMsg) as ParameterDTO[];
                        const telefone = doador.doadorTelefone!.replace("5581", "55819");
                        const componente = new ComponenteDTO(ComponenteTypeEnum.body, parametros);
                        const templateData = new TemplateDataNotificaoDTO(msg.templateName!, {code: 'pt_BR'}, [componente]);
                        const message = new DataNotificationDTO("whatsapp", telefone, "template", templateData);
                        await this.notificacao.execute(message);
                        this.logger.info(`Notificação para ação: ${acao.titulo}`);
                    }
                    await this.acaoRepository.updateStatusAcao(acao.acaoId!, StatusAcaoEnum.EM_ANDAMENTO);
                }
            } else {
                this.logger.info("Nenhuma ação para iniciar hoje.");
            }
        } catch (e: any) {
            this.logger.error(`Erro ao iniciar ação: ${e.message}`);
        }
    }
}   