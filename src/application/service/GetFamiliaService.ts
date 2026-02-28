import { Logger } from "pino";
import { FamiliaEntity } from "../../adapters/persistence/entities/FamiliaEntity";
import { ComunidadeDTO } from "../dto/ComunidadeDTO";
import { PrioridadeEnum } from "../dto/enuns/PrioridadeEnum";
import { TipoAjudaEnum } from "../dto/enuns/TipoAjudaEnum";
import { FamiliaDTO } from "../dto/FamiliaDTO";
import { ListarFamiliasPrioritariasDTO } from "../dto/familias/ListasFamiliasPrioritariasDTO";
import { ListarFamiliaDTO } from "../dto/ListarFamiliaDTO";
import { InternalServerErrorException } from "../exceptions/InternalServerErrorException";
import { GetFamiliaUseCase } from "../port/in/GetFamiliaUseCase";
import { FamiliaRepository } from "../port/out/FamiliaRepository";
import { CalcularPrioridadeAjuda } from "./CalcularPrioridadeAjuda";

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

    public async listarFamilias(): Promise<ListarFamiliaDTO> {
        const [familias, totalFamilias] = await this.familiaRepository.findFamilias();
        const familiaDTO: FamiliaDTO[] = []
        for (const familia of familias) {
            const dtoFamilia = new FamiliaDTO(familia.nomeRepresentante, familia.endereco, familia.qtdPessoasResidencia, familia.qtdPessoasEmpregadas);
            familiaDTO.push(dtoFamilia);
        }
        return new ListarFamiliaDTO(totalFamilias, familiaDTO);
    }

    public async consultarFamiliaPrioridade(tipoAjuda: TipoAjudaEnum): Promise<ListarFamiliasPrioritariasDTO[]> {
        try {
            const familias: FamiliaEntity[] = await this.familiaRepository.getFamiliasPorTipoAjuda(tipoAjuda);
            const familiasClassificadas: FamiliaEntity[] = [];
            for (const familia of familias) {
                const calculo = new CalcularPrioridadeAjuda(familia);
                if (calculo.prioridade === PrioridadeEnum.ALTA) {
                    familiasClassificadas.push(familia);
                }
            }
            const LIMIT_FAMILIAS = 3;
            if (familiasClassificadas.length > LIMIT_FAMILIAS) {
                const familiasEscolhidas = this.escolhaAleatoria(familiasClassificadas, LIMIT_FAMILIAS);
                return familiasEscolhidas.map(familia => new ListarFamiliasPrioritariasDTO(familia.id, familia.nomeRepresentante));
            } else {
                return familiasClassificadas.map(familia => new ListarFamiliasPrioritariasDTO(familia.id, familia.nomeRepresentante));
            }
        } catch (e: any) {
            this.logger.error({ err: e.message }, 'Erro ao listar familias ');
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.");
        }
    }

    private escolhaAleatoria(familiasClassificadas: FamiliaEntity[], limiteFamilia: number): FamiliaEntity[] {
        const array = [...familiasClassificadas];
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.slice(0, limiteFamilia);
    } 
}