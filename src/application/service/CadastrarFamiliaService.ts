import { Logger } from 'pino';
import { AssociarFamiliaComDificuldadeDTO } from "../dto/AssociarFamiliaComDificuldadeDTO";
import { CadastrarFamiliaDTO } from "../dto/CadastrarFamiliaDTO";
import { InternalServerErrorException } from "../exceptions/InternalServerErrorException";
import { CadastrarFamiliaUseCase } from "../port/in/CadastrarFamiliaUseCase";
import { FamiliaRepository } from "../port/out/FamiliaRepository";
import { UnitOfWorkPort } from '../port/out/UnitOfWorkPort';

export class CadastrarFamiliaService implements CadastrarFamiliaUseCase {
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly familiaRepository: FamiliaRepository,
        private readonly unitOfWork: UnitOfWorkPort
    ) {
        this.logger = logger.child({ service: "CadastrarFamiliaUseCase" })
    }
    
    public async execute(dto: CadastrarFamiliaDTO): Promise<void> {
        try {
            await this.unitOfWork.startTransaction();
            const familiaCriada = await this.familiaRepository.save(dto);
            const familiaDificuldades: AssociarFamiliaComDificuldadeDTO[] = []
            for (const idDificuldade of dto.dificuldades) {
                const assFamiliaComDif = new AssociarFamiliaComDificuldadeDTO(idDificuldade, familiaCriada.idFamilia, dto.outros);
                familiaDificuldades.push(assFamiliaComDif);
            }
            await this.familiaRepository.saveFamiliaDificuldade(familiaDificuldades);
            await this.unitOfWork.commit();
        } catch (e: any) {
            await this.unitOfWork.rollBack();
            this.logger.error({ err: e.message }, 'Erro ao persistir ')
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        } finally {
            await this.unitOfWork.release();
        }
    }
}