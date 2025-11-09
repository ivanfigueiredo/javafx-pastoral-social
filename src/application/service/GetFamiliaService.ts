import { FamiliaEntity } from "../../adapters/persistence/entities/FamiliaEntity";
import { ComunidadeDTO } from "../dto/ComunidadeDTO";
import { TipoAjudaEnum } from "../dto/enuns/TipoAjudaEnum";
import { GetFamiliaUseCase } from "../port/in/GetFamiliaUseCase";
import { FamiliaRepository } from "../port/out/FamiliaRepository";
import { CalcularPrioridadeAjuda } from "./CalcularPrioridadeAjuda";

export class GetFamiliaService implements GetFamiliaUseCase {
    constructor(private readonly familiaRepository: FamiliaRepository) {}

    public async listarComunidade(): Promise<ComunidadeDTO[]> {
        return this.familiaRepository.findComunidades();
    }

    public async listarFamilias(): Promise<any> {
        const result = await this.familiaRepository.findFamilias();
        for (const familia of result) {
            const calculo = new CalcularPrioridadeAjuda(familia);
            console.log("====================>>>>>>>>>>>>>>>>>>>>>>>>>>>  ", JSON.stringify(calculo.prioridade));
        }
        return result;
    }

    public async consultarFamiliaPrioridade(tipoAjuda: TipoAjudaEnum): Promise<any> {
        const familias: FamiliaEntity[] = await this.familiaRepository.getFamiliasPorTipoAjuda(tipoAjuda);
        for (const familia of familias) {
            const calculo = new CalcularPrioridadeAjuda(familia);
            console.log("====================>>>>>>>>>>>>>>>>>>>>>>>>>>>  ", JSON.stringify(calculo.prioridade));
        }
    }
}