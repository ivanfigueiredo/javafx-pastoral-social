import { ComunidadeDTO } from "../dto/ComunidadeDTO";
import { GetFamiliaUseCase } from "../port/in/GetFamiliaUseCase";
import { FamiliaRepository } from "../port/out/FamiliaRepository";

export class GetFamiliaService implements GetFamiliaUseCase {
    constructor(private readonly familiaRepository: FamiliaRepository) {}

    public async listarComunidade(): Promise<ComunidadeDTO[]> {
        return this.familiaRepository.findComunidades();
    }

    public async listarFamilias(): Promise<any> {
        return this.familiaRepository.findFamilias();
    }
}