import { Logger } from "pino";
import { NotificacaoWhatsAppGateway } from "../port/out/NotificacaoWhatsAppGateway";
import { EstoqueRepository } from "../port/out/EstoqueRepository";
import { EstoqueEntity } from "../../adapters/persistence/entities/EstoqueEntity";
import { UserEntity } from "../../adapters/persistence/entities/UserEntity";
import { InternalServerErrorException } from "../exceptions/InternalServerErrorException";
import { DataNotificationTemplateTextDTO } from "../dto/notificacao/DataNotificationTemplateLivreDTO";
import { TextDTO } from "../dto/notificacao/TextDTO";
import { ItemProdutoRepository } from "../port/out/ItemProdutoRepository";
import { TempDataRepository } from "../port/out/TempDataRepository";
import { TempDataEntity } from "../../adapters/persistence/entities/TempDataEntity";

export class NotificarAgenteProdutoVencimentoService {
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly notificacao: NotificacaoWhatsAppGateway,
        private readonly itemProdutoRepository: ItemProdutoRepository,
        private readonly estoqueRepository: EstoqueRepository,
        private readonly tempDataRepository: TempDataRepository
    ) {
        this.logger = logger.child({ service: 'NotificarAgenteProdutoVencimentoService' });
    }

    public async execute(coordenador: UserEntity): Promise<void> {
        try {
            const produtosProxVencimento = await this.estoqueRepository.findProdutoProximoVencimento();
            if (produtosProxVencimento.length > 0) {
                let mapProdutos: Map<string, string[]>;
                if (produtosProxVencimento.length > 8) {
                    const primeiraParteProdutos = this.getPrimeiraParte(produtosProxVencimento);
                    mapProdutos = await this.getMapProduct();
                    this.setMapProduto(primeiraParteProdutos, mapProdutos);
                    let texto = "";
                    for (const [key, value] of mapProdutos) {
                        if (value.length > 0) {
                            texto = texto.concat(`*${key}*:\n\n${value.join("\n")}\n\n`);
                        }
                    }
                    await this.publishMessage(texto, coordenador);
                    texto = "";
                    const segundaParteProdutos = this.getSegundaParte(produtosProxVencimento);
                    mapProdutos = await this.getMapProduct();
                    this.setMapProduto(segundaParteProdutos, mapProdutos);
                    for (const [key, value] of mapProdutos) {
                        if (value.length > 0) {
                            texto = texto.concat(`*${key}*:\n\n${value.join("\n")}\n\n`);
                        }
                    }
                    await this.tempDataRepository.save(new TempDataEntity(null, {message: texto, action: 'NotificarAgenteProdutoVencimento'}, new Date()));
                    await this.publishMessage(texto, coordenador);
                } else {
                    mapProdutos = await this.getMapProduct();
                    this.setMapProduto(produtosProxVencimento, mapProdutos);
                    let texto = "";
                    for (const [key, value] of mapProdutos) {
                        if (value.length > 0) {
                            texto = texto.concat(`*${key}*:\n\n${value.join("\n")}\n\n`);
                        }
                    }
                    await this.tempDataRepository.save(new TempDataEntity(null, {message: texto, action: 'NotificarAgenteProdutoVencimento'}, new Date()));
                    await this.publishMessage(texto, coordenador);
                }
            } else {
                this.logger.warn("Mensagem de notificação para produto próximo do vencimento não encontrada.");
            }
        } catch (e: any) {
            this.logger.error('Erro ao notificar agentes sobre produtos vencidos');
            await this.tempDataRepository.save(new TempDataEntity(null, {Erro: e, action: 'NotificarAgenteProdutoVencimento'}, new Date()));
            if (e instanceof InternalServerErrorException) throw e;
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }

    private async publishMessage(mensagemFormat: string, coordenador: UserEntity): Promise<void> {
        const newMsg = this.getMessage().replace("$1", coordenador.nome.split(" ")[0])
            .replace("$2", mensagemFormat);
        const telefone = this.getTelefoneFormatado(coordenador.telefone!);
        const textDTO = new TextDTO(false, newMsg);
        const message = new DataNotificationTemplateTextDTO("whatsapp", telefone, "text", textDTO);
        await this.notificacao.sendMessage(message);
        this.logger.info("Agente notificado com sucesso");
    }

    private getTelefoneFormatado(telefone: string): string {
        return telefone.startsWith("55819") ? telefone : telefone.replace("5581", "55819");
    }

    private getFormatoMensagem(estoque: EstoqueEntity): string | undefined {
        const dias = this.diffInDays(estoque.validade);
        if (dias < 0) return undefined;
        return `Código: ${estoque.codProduto} - Vence em: ${dias} dias`;
    }

    private getPrimeiraParte(estoques: EstoqueEntity[]): EstoqueEntity[] {
        const metade = Math.ceil(estoques.length / 2);
        return estoques.slice(0, metade);
     }

    private getSegundaParte(estoques: EstoqueEntity[]): EstoqueEntity[] {
        const metade = Math.ceil(estoques.length / 2);
        return estoques.slice(metade);
    }

    private diffInDays(vencimento: Date): number {
        const now = Date.now();
        const validade = new Date(vencimento + 'T00:00:00').getTime();

        const diffMs = validade - now;
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        return Math.floor(diffDays);
    }

    private setMapProduto(estoques: EstoqueEntity[], mapa: Map<string, string[]>): void {
        for (const estoque of estoques) {
            const formato = this.getFormatoMensagem(estoque);
            if (formato) {
                mapa.get(estoque.itemProduto.itemProdutoDesc!)?.push(formato);
            }
        }
    }

    private getMessage(): string {
        return "Atenção $1,\nIdentificamos os seguintes produtos próximos do vencimento:\n\n$2Verifique o estoque antes que os produtos fiquem estragados.";
    }

    private async getMapProduct(): Promise<Map<string, string[]>> {
        const produtos = await this.itemProdutoRepository.getProdutos();
        const mapProduto: Map<string, string[]> = new Map();
        for (const prod of produtos) {
            mapProduto.set(prod.itemProdutoDesc!, []);
        }
        return mapProduto;
    }
}