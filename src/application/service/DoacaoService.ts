import { Logger } from "pino";
import { AcaoEntity } from "../../adapters/persistence/entities/AcaoEntity";
import { DoacaoRecebidaEntity } from "../../adapters/persistence/entities/DoacaoRecebidaEntity";
import { DoadorEntity } from "../../adapters/persistence/entities/DoadorEntity";
import { ItemProdutoEntity } from "../../adapters/persistence/entities/ItemProdutoEntity";
import { CadastrarDoacaoDTO } from "../dto/doador/CadastrarDoacaoDTO";
import { DoacaoUseCase } from "../port/in/DoacaoUseCase";
import { DoacaoRepository } from "../port/out/DoacaoRepository";
import { DoadorRepository } from "../port/out/DoadorRepository";
import { UnitOfWorkPort } from "../port/out/UnitOfWorkPort";
import { IdempotenciaPort } from "../port/in/IdempotenciaPort";
import { StatusIdempotenciaEnum } from "../dto/enuns/StatusIdempotenciaEnum";
import { IdempotencyDTO } from "../dto/idempotency/IdempotencyDTO";
import { ContextoIdempotencyEnum } from "../dto/enuns/ContextoIdempotencyEnum";

export class DoacaoService implements DoacaoUseCase {
    private readonly logger: Logger;

    constructor(
        logger: Logger,    
        private readonly unitOfWork: UnitOfWorkPort,
        private readonly doadorRepository: DoadorRepository,
        private readonly doacaoRepository: DoacaoRepository,
        private readonly idempotenciaPort: IdempotenciaPort
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
                }
                const doacoes: DoacaoRecebidaEntity[] = [];
                for (const itemProduto of dto.itensProduto) {
                    const itemProdutoEntity = new ItemProdutoEntity(itemProduto.idItemProduto, null, null, null, [], []);
                    const acao = new AcaoEntity(parseInt(dto.idAcao), null, null, null, null, null, null, null, null, []);
                    const doacao = new DoacaoRecebidaEntity(null, itemProdutoEntity, existDoador ?? doador, dto.tipoDoacao, dto.dataEntrega, null, itemProduto.quantidade, acao);
                    doacoes.push(doacao);
                }
                await this.doacaoRepository.saveMany(doacoes);
                await this.idempotenciaPort.concluirProcessamento(hash);
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