import { Logger } from "pino";
import { ListarAjudasUseCase } from "../port/in/ListarAjudasUseCase";
import { AjudaRepository } from "../port/out/AjudaRepository";
import { InternalServerErrorException } from "../exceptions/InternalServerErrorException";
import { AjudaFilterQueryDTO } from "../dto/AjudaFilterQueryDTO";

export class ListarAjudasService implements ListarAjudasUseCase {
    private readonly logger: Logger;
    
    constructor(
        logger: Logger,
        private readonly ajudaRepository: AjudaRepository
    ) {
        this.logger = logger.child({ service: "ListarAjudasUseCase" })
    }

    public async execute(dto: AjudaFilterQueryDTO): Promise<any> {
        try {

        } catch (e: any) {
            this.logger.error({error: e.message}, 'Erro ao cancelar cesta');
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }
}