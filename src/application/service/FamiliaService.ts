import { AssociarFamiliaComDificuldadeDTO } from "../dto/AssociarFamiliaComDificuldadeDTO";
import { CadastrarFamiliaDTO } from "../dto/CadastrarFamiliaDTO";
import { ComunidadeDTO } from "../dto/ComunidadeDTO";
import { DificuldadeDTO } from "../dto/DificuldadeDTO";
import { FamiliaUseCase } from "../port/in/FamiliaUseCase";
import { FamiliaRepository } from "../port/out/FamiliaRepository";

export class FamiliaService implements FamiliaUseCase {
    constructor(private readonly familiaRepository: FamiliaRepository) {}

    public async cadastrar(dto: CadastrarFamiliaDTO): Promise<void> {
        try {
            const familiaCriada = await this.familiaRepository.save(dto);
            const assFamiliaComDif = new AssociarFamiliaComDificuldadeDTO(dto.idDificuldade, familiaCriada.idFamilia, dto.outros);
            await this.familiaRepository.saveFamiliaDificuldade(assFamiliaComDif);
        } catch (error) {
            console.log("==============>>>>>>>>> ERROR ", error);
        }
    }

    public async listarComunidades(): Promise<ComunidadeDTO[]> {
        return this.familiaRepository.findComunidades();
    }

    public async listarFamilias(): Promise<any> {

    }

    public async listarDificuldades(): Promise<DificuldadeDTO[]> {
        return this.familiaRepository.findDificuldades();
    }
}