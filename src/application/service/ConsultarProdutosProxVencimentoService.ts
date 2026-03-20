import { TempDataEntity } from "../../adapters/persistence/entities/TempDataEntity";
import { MensagemNotificacaoEnum } from "../dto/enuns/MensagemNotificacaoEnum";
import { ComponenteDTO, ParameterDTO } from "../dto/notificacao/ComponenteDTO";
import { ComponenteTypeEnum } from "../dto/notificacao/ComponenteTypeEnum";
import { DataNotificationDTO } from "../dto/notificacao/DataNotificationDTO";
import { TemplateDataNotificaoDTO } from "../dto/notificacao/TemplateDataNotificaoDTO";
import { EstoqueRepository } from "../port/out/EstoqueRepository";
import { MensagemNotificacaoRepository } from "../port/out/MensagemNotificacaoRepository";
import { NotificacaoWhatsAppGateway } from "../port/out/NotificacaoWhatsAppGateway";
import { TempDataRepository } from "../port/out/TempDataRepository";
import { UsuarioRepository } from "../port/out/UsuarioRepository";

export class ConsultarProdutosProxVencimentoService {
    constructor(
        private readonly usuarioRepository: UsuarioRepository,
        private readonly estoqueRepository: EstoqueRepository,
        private readonly mensagemNotificacaoRepository: MensagemNotificacaoRepository,
        private readonly notificacao: NotificacaoWhatsAppGateway,
        private readonly tempDataRepository: TempDataRepository
    ) {}

    public async execute(): Promise<void> {
        try {
            const produtosProxVencimento = await this.estoqueRepository.findProdutoProximoVencimento();
            if (produtosProxVencimento.length > 0) {
                const msg = await this.mensagemNotificacaoRepository.findMensagemNotificacaoById(MensagemNotificacaoEnum.MSG_SOLICITA_PRODUTO_PROX_VENCIMENTO);
                if (msg) {
                    const coordenadores = await this.usuarioRepository.findAllCoordenadores();
                        for (const coordenador of coordenadores) {
                        const newMsg = msg!.parametrosMensagem!.replace("$1", coordenador.nome);
                        const telefone = coordenador.telefone!.startsWith("55") ? coordenador.telefone! : "55".concat(coordenador.telefone!);
                        const parametros = JSON.parse(newMsg) as ParameterDTO[];
                        const componente = new ComponenteDTO(ComponenteTypeEnum.body, parametros);
                        const templateData = new TemplateDataNotificaoDTO(msg.templateName!, {code: 'pt_BR'}, [componente]);
                        const message = new DataNotificationDTO("whatsapp", telefone, "template", templateData);
                        const tempData = new TempDataEntity(null, {message, action: 'ConsultarProdutosProxVencimento'}, new Date());
                        await this.tempDataRepository.save(tempData);
                        await this.notificacao.execute(message);
                    }
                }
            }
        } catch (e: any) {
            await this.tempDataRepository.save(new TempDataEntity(null, {Erro: e, action: 'ConsultarProdutosProxVencimento'}, new Date()));
            console.error({error: e.message}, 'Erro ao processar visualização de produtos próximos do vencimento');
        }
    }
}