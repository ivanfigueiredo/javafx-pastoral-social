import { AssociarFamiliaComDificuldadeDTO } from "../dto/AssociarFamiliaComDificuldadeDTO";
import { CadastrarFamiliaDTO } from "../dto/CadastrarFamiliaDTO";
import { InternalServerErrorException } from "../exceptions/InternalServerErrorException";
import { CadastrarFamiliaUseCase } from "../port/in/CadastrarFamiliaUseCase";
import { FamiliaRepository } from "../port/out/FamiliaRepository";

export class CadastrarFamiliaService implements CadastrarFamiliaUseCase {
    constructor(private readonly familiaRepository: FamiliaRepository) {}
    
    public async execute(dto: CadastrarFamiliaDTO): Promise<void> {
        try {
            const familiaCriada = await this.familiaRepository.save(dto);
            const assFamiliaComDif = new AssociarFamiliaComDificuldadeDTO(dto.idDificuldade, familiaCriada.idFamilia, dto.outros);
            await this.familiaRepository.saveFamiliaDificuldade(assFamiliaComDif);
        } catch (error) {
            console.log("==============>>>>>>>>> ERROR ", error);
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }
}