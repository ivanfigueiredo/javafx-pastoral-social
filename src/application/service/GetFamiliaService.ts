import { FamiliaEntity } from "../../adapters/persistence/entities/FamiliaEntity";
import { ComunidadeDTO } from "../dto/ComunidadeDTO";
import { TipoAjudaEnum } from "../dto/enuns/TipoAjudaEnum";
import { FamiliaDTO } from "../dto/FamiliaDTO";
import { ListarFamiliaDTO } from "../dto/ListarFamiliaDTO";
import { GetFamiliaUseCase } from "../port/in/GetFamiliaUseCase";
import { FamiliaRepository } from "../port/out/FamiliaRepository";
import { CalcularPrioridadeAjuda } from "./CalcularPrioridadeAjuda";

export class GetFamiliaService implements GetFamiliaUseCase {
    constructor(private readonly familiaRepository: FamiliaRepository) {}

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

    public async consultarFamiliaPrioridade(tipoAjuda: TipoAjudaEnum): Promise<any> {
        const familias: FamiliaEntity[] = await this.familiaRepository.getFamiliasPorTipoAjuda(tipoAjuda);
        for (const familia of familias) {
            const calculo = new CalcularPrioridadeAjuda(familia);
            console.log("====================>>>>>>>>>>>>>>>>>>>>>>>>>>>  ", JSON.stringify(calculo.prioridade));
        }
    }
}