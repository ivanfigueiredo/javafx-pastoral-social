import { Logger } from "pino";
import { AjudaRepository } from "../port/out/AjudaRepository";
import { InternalServerErrorException } from "../exceptions/InternalServerErrorException";
import { NotFoundException } from "../exceptions/NotFoundException";
import { StatusAjudaEnum } from "../dto/enuns/StatusAjudaEnum";
import { UnprocessableException } from "../exceptions/UnprocessableException";
import { UnitOfWorkPort } from "../port/out/UnitOfWorkPort";
import { EntregarAjudaUseCase } from "../port/in/EntregarAjudaUseCase";
import { EntregarAjudaDTO } from "../dto/ajuda/EntregarAjudaDTO";

export class EntregarAjudaService implements EntregarAjudaUseCase {
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly ajudaRepository: AjudaRepository,
        private readonly unitOfWork: UnitOfWorkPort
    ) {
        this.logger = logger.child({ service: "EntregarAjudaUseCase" });
    }
    
    public async execute(dto: EntregarAjudaDTO): Promise<void> {
        try {
            await this.unitOfWork.startTransaction();
            const ajuda = await this.ajudaRepository.findAjudaById(dto.idAjuda);
            if (!ajuda) {
                throw new NotFoundException(`Ajuda nao encontrada. AjudaId: ${dto.idAjuda}`);
            }
            if (ajuda.statusAjuda !== StatusAjudaEnum.APROVADA) {
                throw new UnprocessableException("A ajuda precisa estar aprovada para ser entregue.");
            }
            ajuda.statusAjuda = StatusAjudaEnum.ENTREGUE;
            await this.ajudaRepository.save(ajuda);
            await this.unitOfWork.commit();
        } catch (e: any) {
            this.logger.error({error: e.message}, 'Erro ao entregar ajuda ');
            await this.unitOfWork.rollBack();
            if (e instanceof NotFoundException || e instanceof UnprocessableException) throw e;
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        } finally {
            await this.unitOfWork.release();
        }
    }
}