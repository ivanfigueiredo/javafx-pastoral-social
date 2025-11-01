import { ComunidadeDTO } from "../dto/ComunidadeDTO";
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
}