import { Logger } from "pino";
import { AprovarAjudaDTO } from "../dto/ajuda/AprovarAjudaDTO";
import { AprovarAjudaUseCase } from "../port/in/AprovarAjudaUseCase";
import { AjudaRepository } from "../port/out/AjudaRepository";
import { InternalServerErrorException } from "../exceptions/InternalServerErrorException";
import { NotFoundException } from "../exceptions/NotFoundException";
import { StatusAjudaEnum } from "../dto/enuns/StatusAjudaEnum";
import { UnprocessableException } from "../exceptions/UnprocessableException";
import { UnitOfWorkPort } from "../port/out/UnitOfWorkPort";

export class AprovarAjudaService implements AprovarAjudaUseCase {
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly ajudaRepository: AjudaRepository,
        private readonly unitOfWork: UnitOfWorkPort
    ) {
        this.logger = logger.child({ service: "AprovarAjudaUseCase" });
    }
    
    public async execute(dto: AprovarAjudaDTO): Promise<void> {
        try {
            await this.unitOfWork.startTransaction();
            const ajuda = await this.ajudaRepository.findAjudaById(dto.idAjuda);
            if (!ajuda) {
                throw new NotFoundException(`Ajuda nao encontrada. AjudaId: ${dto.idAjuda}`);
            }
            if (ajuda.statusAjuda !== StatusAjudaEnum.AGUARDANDO_APROVACAO) {
                throw new UnprocessableException("A ajuda precisa estar aguardando aprovacao para ser aprovada.");
            }
            ajuda.statusAjuda = StatusAjudaEnum.APROVADA;
            ajuda.entregaAprovada = true;
            await this.ajudaRepository.save(ajuda);
            await this.unitOfWork.commit();
        } catch (e: any) {
            this.logger.error({error: e.message}, 'Erro ao aprovar ajuda ');
            await this.unitOfWork.rollBack();
            if (e instanceof NotFoundException || e instanceof UnprocessableException) throw e;
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        } finally {
            await this.unitOfWork.release();
        }
    }
}