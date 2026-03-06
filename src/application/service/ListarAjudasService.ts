import { Logger } from "pino";
import { ListarAjudasUseCase } from "../port/in/ListarAjudasUseCase";
import { AjudaRepository } from "../port/out/AjudaRepository";
import { InternalServerErrorException } from "../exceptions/InternalServerErrorException";
import { AjudaFilterQueryDTO } from "../dto/AjudaFilterQueryDTO";
import { StatusAjudaEnum } from "../../adapters/persistence/entities/StatusAjudaEnum";
import { TipoAjudaEnum } from "../dto/enuns/TipoAjudaEnum";
import { OpcaoListaDTO } from "../dto/OpcaoListaDTO";
import { PaginatedDTO } from "../dto/PaginatedDTO";

export class ListarAjudasService implements ListarAjudasUseCase {
    private readonly logger: Logger;
    
    constructor(
        logger: Logger,
        private readonly ajudaRepository: AjudaRepository
    ) {
        this.logger = logger.child({ service: "ListarAjudasUseCase" })
    }

    public async listarAjudas(dto: AjudaFilterQueryDTO): Promise<PaginatedDTO> {
        try {
            const [ajudas, totalAjuda] = await this.ajudaRepository.findAjudas(dto);
            const result: Result[] = ajudas.map(ajuda => ({
                id: ajuda.id,
                representante: ajuda.familia.nomeRepresentante,
                endereco: ajuda.familia.endereco,
                statusAjuda: ajuda.statusAjuda.valueOf(),
                tipoAjuda: ajuda.tipoAjuda.descricao!,
                dataEntrega: (ajuda.dataEntrega != null) ? ajuda.dataEntrega.toISOString() : null,
            }));
            const response = {
                total: totalAjuda,
                pendentes: ajudas.filter(ajuda => ajuda.statusAjuda === StatusAjudaEnum.AGUARDANDO_APROVACAO).length,
                concluidas: ajudas.filter(ajuda => ajuda.statusAjuda === StatusAjudaEnum.ENTREGUE).length,
                data: result
            }
            return new PaginatedDTO(parseInt(`${dto.page}`), totalAjuda, Math.ceil(totalAjuda / dto.pageSize), response);
        } catch (e: any) {
            this.logger.error({error: e.message}, 'Erro ao cancelar cesta');
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }

    public async listarAjudasOpcaoLista(): Promise<OpcaoListaDTO[]> {
        try {
            const ajudas = await this.ajudaRepository.findAjudasOpcaoLista();
            return ajudas;
        } catch (e: any) {
            this.logger.error({error: e.message}, 'Erro ao listar opções de ajuda');
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }
}

type Result = {
    id: number | null,
    representante: string,
    endereco: string | null,
    statusAjuda: string,
    tipoAjuda: string,
    dataEntrega: string | null
}