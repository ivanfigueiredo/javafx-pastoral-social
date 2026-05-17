import { Logger } from "pino";
import { FamiliaEntity } from "../../adapters/persistence/entities/FamiliaEntity";
import { ComunidadeDTO } from "../dto/ComunidadeDTO";
import { PrioridadePeso } from "../dto/enuns/PrioridadeEnum";
import { TipoAjudaEnum } from "../dto/enuns/TipoAjudaEnum";
import { FamiliaDificuldadeDTO, FamiliaDTO } from "../dto/familias/FamiliaDTO";
import { ListarFamiliasPrioritariasDTO } from "../dto/familias/ListasFamiliasPrioritariasDTO";
import { InternalServerErrorException } from "../exceptions/InternalServerErrorException";
import { OpcaoListaDTO } from "../dto/OpcaoListaDTO";
import { GetFamiliaUseCase } from "../port/in/GetFamiliaUseCase";
import { FamiliaRepository } from "../port/out/FamiliaRepository";
import { CalcularPrioridadeAjuda } from "./CalcularPrioridadeAjuda";
import { FamiliaFilterQueryDTO } from "../dto/familias/FamiliaFilterQueryDTO";
import { PaginatedDTO } from "../dto/PaginatedDTO";

export class GetFamiliaService implements GetFamiliaUseCase {
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly familiaRepository: FamiliaRepository
    ) {
        this.logger = logger.child({ service: 'GetFamiliaUseCase' });
    }

    public async listarComunidade(): Promise<ComunidadeDTO[]> {
        return this.familiaRepository.findComunidades();
    }

    public async listarFamilias(dto: FamiliaFilterQueryDTO): Promise<PaginatedDTO> {
        try {
            const [familias, totalFamilias] = await this.familiaRepository.findFamilias(dto);
            const familiasComPrioridade = familias.map(familia => {
                const calculo = new CalcularPrioridadeAjuda(familia);
                return {
                    familia,
                    prioridade: calculo.prioridade
                };
            });
            familiasComPrioridade.sort((a, b) => {
                return PrioridadePeso[a.prioridade] - PrioridadePeso[b.prioridade];
            });
            const result = familiasComPrioridade.map(fcp => new FamiliaDTO(
                fcp.familia.id, 
                fcp.familia.nomeRepresentante, 
                fcp.familia.endereco, 
                fcp.familia.qtdPessoasResidencia, 
                fcp.familia.qtdPessoasEmpregadas,
                new ComunidadeDTO(fcp.familia.comunidade.id!, fcp.familia.comunidade.descricao!),
                fcp.familia.dificuldades.map(d => new FamiliaDificuldadeDTO(d.dificuldade!.id!, d.dificuldade!.descricao)),
                fcp.familia.telefone,
                fcp.familia.criancasFrequentamEscola,
                fcp.familia.membroComProblemaSaude
            ));
            return new PaginatedDTO(parseInt(`${dto.page}`), totalFamilias, Math.ceil(totalFamilias / dto.pageSize), result);
        } catch (e: any) {
            this.logger.error({ err: e.message }, 'Erro ao listar familias ');
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.");
        }
    }

    public async consultarFamiliaPrioridade(tipoAjuda: TipoAjudaEnum): Promise<ListarFamiliasPrioritariasDTO[]> {
        try {
            const familias: FamiliaEntity[] = await this.familiaRepository.getFamiliasPorTipoAjuda(tipoAjuda);
            const familiasComPrioridade = familias.map(familia => {
                const calculo = new CalcularPrioridadeAjuda(familia);
                return {
                    familia,
                    prioridade: calculo.prioridade
                };
            });
            familiasComPrioridade.sort((a, b) => {
                return PrioridadePeso[a.prioridade] - PrioridadePeso[b.prioridade];
            });
            const LIMIT_FAMILIAS = 3;
            const topFamilias = familiasComPrioridade.slice(0, LIMIT_FAMILIAS);
            return topFamilias.map(item => 
                new ListarFamiliasPrioritariasDTO(
                    item.familia.id,
                    item.familia.nomeRepresentante
                )
            );
        } catch (e: any) {
            this.logger.error({ err: e.message }, 'Erro ao listar familias ');
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.");
        }
    }
    
    public async listarFamiliaOpcaoLista(): Promise<OpcaoListaDTO[]> {
        const familiasOpcaoLista = await this.familiaRepository.findFamiliaOptionLista();
        return familiasOpcaoLista;
    }
}