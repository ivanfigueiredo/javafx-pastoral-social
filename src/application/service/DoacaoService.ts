import { Logger } from "pino";
import { DoacaoRecebidaEntity } from "../../adapters/persistence/entities/DoacaoRecebidaEntity";
import { DoadorEntity } from "../../adapters/persistence/entities/DoadorEntity";
import { ItemProdutoEntity } from "../../adapters/persistence/entities/ItemProdutoEntity";
import { CadastrarDoacaoDTO } from "../dto/doador/CadastrarDoacaoDTO";
import { DoacaoUseCase } from "../port/in/DoacaoUseCase";
import { DoacaoRepository } from "../port/out/DoacaoRepository";
import { DoadorRepository } from "../port/out/DoadorRepository";
import { UnitOfWorkPort } from "../port/out/UnitOfWorkPort";
import { IdempotenciaPort } from "../port/in/IdempotenciaPort";
import { IdempotencyDTO } from "../dto/idempotency/IdempotencyDTO";
import { ContextoIdempotencyEnum } from "../dto/enuns/ContextoIdempotencyEnum";
import { NotificarDoacaoRecebidaDoadorDTO } from "../dto/doador/NotificarDoacaoRecebidaDoadorDTO";
import { NotificacaoAgradecimentoDoacaoService } from "./NotificacaoAgradecimentoDoacaoService";
import { AcaoRepository } from "../port/out/AcaoRepository";
import { NotFoundException } from "../exceptions/NotFoundException";
import { UnprocessableException } from "../exceptions/UnprocessableException";

export class DoacaoService implements DoacaoUseCase {
    private readonly logger: Logger;

    constructor(
        logger: Logger,    
        private readonly unitOfWork: UnitOfWorkPort,
        private readonly acaoRepository: AcaoRepository,
        private readonly doadorRepository: DoadorRepository,
        private readonly doacaoRepository: DoacaoRepository,
        private readonly idempotenciaPort: IdempotenciaPort,
        private readonly notificacaoAgradecimentoDoacaoService: NotificacaoAgradecimentoDoacaoService
    ) {
        this.logger = logger.child({ service: "DoacaoUseCase" });
    }

    public async cadastrarDoacao(dto: CadastrarDoacaoDTO): Promise<void> {
        try {
            await this.unitOfWork.startTransaction();
            const hash = this.idempotenciaPort.generateHash(dto);
            const hasProcessado = await this.idempotenciaPort.hasProcessado(hash);
            if (!hasProcessado) {
                const idempotencyData = new IdempotencyDTO(hash, dto, ContextoIdempotencyEnum.RECEBER_DOACAO);
                await this.idempotenciaPort.salvarIdempotenciaRecord(idempotencyData);
                let doador: DoadorEntity = new DoadorEntity(null, null, null, []);
                const existDoador = await this.doadorRepository.findDoadorByTelefone(dto.doador.cleanTelefone());
                if (!existDoador) {
                    doador = new DoadorEntity(null, dto.doador.nomeDoador, dto.doador.cleanTelefone(), []);
                    doador = await this.doadorRepository.save(doador);
                } else {
                    doador = existDoador;
                }
                const doacoes: DoacaoRecebidaEntity[] = [];
                const acao = await this.acaoRepository.findById(parseInt(dto.idAcao));
                if (!acao) throw new NotFoundException(`Ação com id ${dto.idAcao} não encontrada.`);
                if (acao.statusAcao === "CONCLUIDA") throw new UnprocessableException("Não é possível receber doações para ações já concluídas.");
                if (acao.statusAcao === "PLANEJADA") throw new UnprocessableException("Não é possível receber doações para ações que ainda não foram iniciadas.");
                for (const itemProduto of dto.itensProduto) {
                    const itemProdutoEntity = new ItemProdutoEntity(itemProduto.idItemProduto, null, null, null, [], []);
                    const doacao = new DoacaoRecebidaEntity(null, itemProdutoEntity, doador, dto.tipoDoacao, dto.dataEntrega, null, itemProduto.quantidade, acao);
                    doacoes.push(doacao);
                }
                await this.doacaoRepository.saveMany(doacoes);
                await this.idempotenciaPort.concluirProcessamento(hash);
                const data = new NotificarDoacaoRecebidaDoadorDTO(doador.doadorNome!, doador.doadorTelefone!.startsWith("55") ? doador.doadorTelefone! : "55".concat(doador.doadorTelefone!));
                await this.notificacaoAgradecimentoDoacaoService.execute(data);
            } else {
                this.logger.info("Ignorando requisicao ja processada.");
            }
            await this.unitOfWork.commit();
        } catch (e: any) {
            this.logger.error({ err: e.message }, 'Erro ao persistir ')
            await this.unitOfWork.rollBack();
        } finally {
            await this.unitOfWork.release();
        }
    }
}