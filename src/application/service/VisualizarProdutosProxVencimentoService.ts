import { Logger } from "pino";
import { WebHookContactDTO, WebHookMetaMessageDTO } from "../dto/notificacao/webhook/WebHookMetaPayloadDTO";
import { VisualizarProdutosProxVencimentoUseCase } from "../port/in/VisualizarProdutosProxVencimentoUseCase";
import { UsuarioRepository } from "../port/out/UsuarioRepository";
import { NotificarAgenteProdutoVencimentoService } from "./NotificarAgenteProdutoVencimentoService";
import { TempDataRepository } from "../port/out/TempDataRepository";
import { TempDataEntity } from "../../adapters/persistence/entities/TempDataEntity";

export class VisualizarProdutosProxVencimentoService implements VisualizarProdutosProxVencimentoUseCase {
    private readonly logger: Logger;
    
    constructor(
        logger: Logger,
        private readonly usuarioRepository: UsuarioRepository,
        private readonly notificarAgenteProdutoVencimentoService: NotificarAgenteProdutoVencimentoService,
        private readonly tempDataRepository: TempDataRepository
    ) {
        this.logger = logger.child({ service: 'VisualizarProdutosProxVencimentoService' });
    }

    public async execute(contacts: WebHookContactDTO[], messages: WebHookMetaMessageDTO[]): Promise<void> {
        try {
            for (const message of messages) {
                if (message.type === 'button' && message.button && message.button.text === 'Listar itens' ) {
                    const contact = contacts.find(c => c.wa_id === message.from);
                    if (contact) {
                        const telefone = contact.wa_id.replace("5581", "55819");
                        const user = await this.usuarioRepository.findByTelefone(telefone);
                        if (user) {
                            await this.tempDataRepository.save(new TempDataEntity(null, {user, action: 'VisualizarProdutosProxVencimento'}, new Date()));
                            await this.notificarAgenteProdutoVencimentoService.execute(user);
                        }
                    }
                }
            }
        } catch (e: any) {
            await this.tempDataRepository.save(new TempDataEntity(null, {Erro: e, action: 'VisualizarProdutosProxVencimento'}, new Date()));
            this.logger.error({Error: JSON.stringify(e.message, null, 2)});
        }
    }
}