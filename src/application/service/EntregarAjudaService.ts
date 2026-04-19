import { Logger } from "pino";
import { AjudaRepository } from "../port/out/AjudaRepository";
import { InternalServerErrorException } from "../exceptions/InternalServerErrorException";
import { NotFoundException } from "../exceptions/NotFoundException";
import { StatusAjudaEnum } from "../dto/enuns/StatusAjudaEnum";
import { UnprocessableException } from "../exceptions/UnprocessableException";
import { UnitOfWorkPort } from "../port/out/UnitOfWorkPort";
import { EntregarAjudaUseCase } from "../port/in/EntregarAjudaUseCase";
import { EntregarAjudaDTO } from "../dto/ajuda/EntregarAjudaDTO";
import { TipoAjudaEnum } from "../dto/enuns/TipoAjudaEnum";
import { StatusCestaEntity } from "../../adapters/persistence/entities/StatusCestaEntity";
import { StatusCestaEnum } from "../dto/enuns/StatusCestaEnum";
import { CestaGeradaRepository } from "../port/out/CestaGeradaRepository";

export class EntregarAjudaService implements EntregarAjudaUseCase {
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly ajudaRepository: AjudaRepository,
        private readonly cestaRepository: CestaGeradaRepository,
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
            if (ajuda.tipoAjuda.id === TipoAjudaEnum.CESTA_BASICA && ajuda.cestaGerada) {
                const cesta = ajuda.cestaGerada;
                cesta.status = new StatusCestaEntity(StatusCestaEnum.ENTREGUE, null, []);
                await this.cestaRepository.save(cesta);
                this.logger.info({ statusCesta: StatusCestaEnum.ENTREGUE }, 'Atualizando status da cesta para: ');
            }
            ajuda.statusAjuda = StatusAjudaEnum.ENTREGUE;
            ajuda.dataEntrega = this.getLocalDate();
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

    private getLocalDate(): string {
        const hoje = new Date();
        const dataLocal = new Date(
            hoje.getFullYear(),
            hoje.getMonth(),
            hoje.getDate()
        );
        return dataLocal.toISOString().split("T")[0];
    }
}