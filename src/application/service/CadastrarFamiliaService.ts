import { Logger } from 'pino';
import { AssociarFamiliaComDificuldadeDTO } from "../dto/AssociarFamiliaComDificuldadeDTO";
import { CadastrarFamiliaDTO } from "../dto/CadastrarFamiliaDTO";
import { InternalServerErrorException } from "../exceptions/InternalServerErrorException";
import { CadastrarFamiliaUseCase } from "../port/in/CadastrarFamiliaUseCase";
import { FamiliaRepository } from "../port/out/FamiliaRepository";

export class CadastrarFamiliaService implements CadastrarFamiliaUseCase {
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly familiaRepository: FamiliaRepository
    ) {
        this.logger = logger.child({ service: "CadastrarFamiliaUseCase" })
    }
    
    public async execute(dto: CadastrarFamiliaDTO): Promise<void> {
        try {
            const familiaCriada = await this.familiaRepository.save(dto);
            const assFamiliaComDif = new AssociarFamiliaComDificuldadeDTO(dto.idDificuldade, familiaCriada.idFamilia, dto.outros);
            await this.familiaRepository.saveFamiliaDificuldade(assFamiliaComDif);
        } catch (e: any) {
            this.logger.error({ err: e.message }, 'Erro ao persistir ')
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }
}