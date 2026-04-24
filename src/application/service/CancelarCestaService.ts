import { Logger } from "pino";
import { StatusCestaEntity } from "../../adapters/persistence/entities/StatusCestaEntity";
import { CancelarCestaDTO } from "../dto/CancelarCestaDTO";
import { StatusCestaEnum } from "../dto/enuns/StatusCestaEnum";
import { NotFoundException } from "../exceptions/NotFoundException";
import { CancelarCestaUseCase } from "../port/in/CancelarCestaUseCase";
import { CestaGeradaRepository } from "../port/out/CestaGeradaRepository";
import { EstoqueRepository } from "../port/out/EstoqueRepository";
import { InternalServerErrorException } from "../exceptions/InternalServerErrorException";
import { EstoqueEntity } from "../../adapters/persistence/entities/EstoqueEntity";
import { UnitOfWorkPort } from "../port/out/UnitOfWorkPort";
import { StatusAjudaEnum } from "../../adapters/persistence/entities/StatusAjudaEnum";
import { AjudaRepository } from "../port/out/AjudaRepository";
import { UnprocessableException } from "../exceptions/UnprocessableException";

export class CancelarCestaService implements CancelarCestaUseCase {
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly cestaGeradaRepository: CestaGeradaRepository,
        private readonly ajudaRepository: AjudaRepository,
        private readonly estoqueRepository: EstoqueRepository,
        private readonly unitOfWork: UnitOfWorkPort
    ) {
        this.logger = logger.child({ service: 'CancelarCestaUseCase' });
    }

    public async execute(dto: CancelarCestaDTO): Promise<void> {
        try {
            await this.unitOfWork.startTransaction();
            const cesta = await this.cestaGeradaRepository.findCestaById(dto.idCesta);
            if (!cesta) throw new NotFoundException('A cesta informada não foi encontrada.');
            if (cesta.ajuda != null) {
                throw new UnprocessableException("Não é possível cancelar a cesta, pois já está vinculada a uma ajuda.");
            }
            const estoque: EstoqueEntity[] = [];
            for (const itemCesta of cesta.cestaItens) {
                itemCesta.cestaEstoqueItem.dataSaida = null;
                itemCesta.cestaEstoqueItem.isDisponivel = true;
                estoque.push(itemCesta.cestaEstoqueItem);
            }
            cesta.status = new StatusCestaEntity(StatusCestaEnum.CANCELADA, null, []);
            await this.cestaGeradaRepository.save(cesta);
            await this.estoqueRepository.saveMany(estoque);
            await this.unitOfWork.commit();
        } catch (e: any) {
            await this.unitOfWork.rollBack();
            this.logger.error({error: e.message}, 'Erro ao cancelar cesta');
            if (e instanceof NotFoundException || e instanceof UnprocessableException) throw e;
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        } finally {
            await this.unitOfWork.release();
        }
    }
}