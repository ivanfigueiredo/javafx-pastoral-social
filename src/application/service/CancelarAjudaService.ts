import { Logger } from 'pino';
import { CancelarAjudaDTO } from '../dto/CancelarAjudaDTO';
import { CancelarAjudaUseCase } from '../port/in/CancelarAjudaUseCase'
import { AjudaRepository } from '../port/out/AjudaRepository';
import { UnitOfWorkPort } from '../port/out/UnitOfWorkPort';
import { NotFoundException } from '../exceptions/NotFoundException';
import { InternalServerErrorException } from '../exceptions/InternalServerErrorException';
import { StatusAjudaEnum } from '../../adapters/persistence/entities/StatusAjudaEnum';
import { StatusCestaEntity } from '../../adapters/persistence/entities/StatusCestaEntity';
import { StatusCestaEnum } from '../dto/enuns/StatusCestaEnum';
import { TipoAjudaEnum } from '../dto/enuns/TipoAjudaEnum';

export class CancelarAjudaService implements CancelarAjudaUseCase {
    private readonly logger: Logger;
    
    constructor(
        logger: Logger,
        private readonly ajudaRepository: AjudaRepository,
        private readonly unitOfWork: UnitOfWorkPort
    ) {
        this.logger = logger.child({ service: "CancelarAjudaUseCase" })
    }

    public async execute(dto: CancelarAjudaDTO): Promise<void> {
        try {
            this.logger.info("Iniciando fluxo de cancelamento de ajuda")
            await this.unitOfWork.startTransaction();
            const ajuda = await this.ajudaRepository.findAjudaById(dto.idAjuda);
            if (!ajuda) throw new NotFoundException("Ajuda informada não foi encontrada.");
            ajuda.statusAjuda = StatusAjudaEnum.CANCELADA;
            if (ajuda.tipoAjuda.id === TipoAjudaEnum.CESTA_BASICA && ajuda.cestaGerada != null) {
                const newStatusCesta = new StatusCestaEntity(StatusCestaEnum.CRIADA, null, []);
                ajuda.cestaGerada.status = newStatusCesta;
            }
            await this.ajudaRepository.save(ajuda);
            this.logger.info({idAjuda: ajuda.id}, 'Ajuda cancelada com sucesso');
            await this.unitOfWork.commit();
        } catch (e: any) {
            await this.unitOfWork.rollBack();
            this.logger.error({error: e.message}, 'Erro ao cancelar ajuda');
            if (e instanceof NotFoundException) throw e;
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }
}