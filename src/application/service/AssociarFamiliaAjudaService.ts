import { Logger } from "pino";
import { AssociarAjudaFamiliaDTO } from "../dto/AssociarAjudaFamiliaDTO";
import { AssociarFamiliaAjudaUseCase } from "../port/in/AssociarFamiliaAjudaUseCase";
import { AjudaRepository } from "../port/out/AjudaRepository";
import { CestaGeradaRepository } from "../port/out/CestaGeradaRepository";
import { FamiliaRepository } from "../port/out/FamiliaRepository";
import { NotFoundException } from "../exceptions/NotFoundException";
import { InternalServerErrorException } from "../exceptions/InternalServerErrorException";
import { AjudaRecebidaEntity } from "../../adapters/persistence/entities/AjudaRecebidaEntity";
import { TipoAjudaEntity } from "../../adapters/persistence/entities/TipoAjudaEntity";
import { TipoAjudaEnum } from "../dto/enuns/TipoAjudaEnum";
import { StatusCestaEntity } from "../../adapters/persistence/entities/StatusCestaEntity";
import { StatusCestaEnum } from "../dto/enuns/StatusCestaEnum";
import { UnprocessableException } from "../exceptions/UnprocessableException";
import { UnitOfWorkPort } from "../port/out/UnitOfWorkPort";
import { StatusAjudaEnum } from "../../adapters/persistence/entities/StatusAjudaEnum";

export class AssociarFamiliaAjudaService implements AssociarFamiliaAjudaUseCase {
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly cestaGeradaRepository: CestaGeradaRepository,
        private readonly ajudaRepository: AjudaRepository,
        private readonly familiaRepository: FamiliaRepository,
        private readonly unitOfWork: UnitOfWorkPort
    ) {
        this.logger = logger.child({ service: 'AssociarFamiliaAjudaUseCase' });
    }

    public async execute(dto: AssociarAjudaFamiliaDTO[]): Promise<void> {
        this.logger.info('Iniciando fluxo de associacao da ajuda para familia');
        try {
            await this.unitOfWork.startTransaction();
            const ajudasDoada: AjudaRecebidaEntity[] = [];
            for (const item of dto) {
                this.logger.info({idFamilia: item.idFamilia}, 'Buscando familia pelo id');
                const familia = await this.familiaRepository.findFamiliaById(item.idFamilia);
                let ajudaRecebida: AjudaRecebidaEntity;
                const detalhe = JSON.stringify({detalhe: item.ajuda.observacao})
                if (!familia) throw new NotFoundException('Familia não encontrada.');
                if (item.ajuda.tipoAjuda == TipoAjudaEnum.CESTA_BASICA) {
                    const cestas = await this.cestaGeradaRepository.findCestasByIdTemplate(item.ajuda.idTemplate);
                    if (cestas === null || cestas.length === 0) throw new UnprocessableException("O template informado não tem cestas disponíveis");
                    const cesta = cestas[0];
                    cesta.status = new StatusCestaEntity(StatusCestaEnum.RESERVADA, null, []);
                    this.logger.info({ statusCesta: StatusCestaEnum.RESERVADA }, 'Atualizando status da cesta para: ');
                    const tipoAjuda = new TipoAjudaEntity(TipoAjudaEnum.CESTA_BASICA, null, null, []);
                    ajudaRecebida = new AjudaRecebidaEntity(null, null, false, false, StatusAjudaEnum.AGUARDANDO_APROVACAO, null, detalhe, new Date(), familia, tipoAjuda, cesta);
                } else {
                    const tipoAjuda = new TipoAjudaEntity(item.ajuda.tipoAjuda, null, null, []);
                    ajudaRecebida = new AjudaRecebidaEntity(null, null, false, false, StatusAjudaEnum.AGUARDANDO_APROVACAO, null, detalhe, new Date(), familia, tipoAjuda, null);
                }
                ajudasDoada.push(ajudaRecebida);
            }
            await this.ajudaRepository.criarAjuda(ajudasDoada);
            this.logger.info('Ajudas doadas salvas com sucesso.');
            await this.unitOfWork.commit();
        } catch (e: any) {
            this.logger.error({err: e.message}, 'Erro ao associar familia a ajuda');
            await this.unitOfWork.rollBack();
            if (e instanceof NotFoundException || e instanceof UnprocessableException) throw e;
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.");
        }
    }
}