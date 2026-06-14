import { AssociarFamiliaComDificuldadeDTO } from "../dto/AssociarFamiliaComDificuldadeDTO";
import { CadastrarFamiliaDTO } from "../dto/familias/CadastrarFamiliaDTO";
import { ComunidadeDTO } from "../dto/ComunidadeDTO";
import { DificuldadeDTO } from "../dto/DificuldadeDTO";
import { ConsultarFamiliaUseCase } from "../port/in/ConsultarFamiliaUseCase";
import { FamiliaRepository } from "../port/out/FamiliaRepository";

export class ConsultarFamiliaService implements ConsultarFamiliaUseCase {
    constructor(private readonly familiaRepository: FamiliaRepository) {}

    public async listarComunidades(): Promise<ComunidadeDTO[]> {
        return this.familiaRepository.findComunidades();
    }

    public async listarFamilias(): Promise<any> {

    }

    public async listarDificuldades(): Promise<DificuldadeDTO[]> {
        return this.familiaRepository.findDificuldades();
    }
}