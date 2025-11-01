import { Repository } from "typeorm";
import { CadastrarFamiliaDTO } from "../../application/dto/CadastrarFamiliaDTO";
import { ComunidadeDTO } from "../../application/dto/ComunidadeDTO";
import { DificuldadeDTO } from "../../application/dto/DificuldadeDTO";
import { FamiliaRepository } from "../../application/port/out/FamiliaRepository";
import { Connection } from "./database/Connection";
import { DificuldadeEntity } from "./entities/DificuldadeEntity";
import { FamiliaEntity } from "./entities/FamiliaEntity";
import { ComunidadeEntity } from "./entities/ComunidadeEntity";
import { FamiliaMapper } from "../mappers/FamiliaMapper";
import { FamiliaCadastradaDTO } from "../../application/dto/FamiliaCadastradaDTO";
import { AssociarFamiliaComDificuldadeDTO } from "../../application/dto/AssociarFamiliaComDificuldadeDTO";
import { FamiliaDificuldadeEntity } from "./entities/FamiliaDificuldadeEntity";
import { UnitOfWork } from "./unitOfWork/UnitOfWork";
import { Logger } from "pino";
import { InternalServerErrorException } from "../../application/exceptions/InternalServerErrorException";

export class FamiliaPostgresDatabase implements FamiliaRepository {
    private readonly logger: Logger;
    private readonly familiaRepository: Repository<FamiliaEntity>;
    private readonly dificuldadeRepository: Repository<DificuldadeEntity>;
    private readonly comunidadeRepository: Repository<ComunidadeEntity>;
    private readonly familiaDificuldadeRepository: Repository<FamiliaDificuldadeEntity>;

    constructor(
        logger: Logger,
        private readonly connection: Connection,
        private readonly unitOfWork: UnitOfWork
    ) {
        this.logger = logger.child({service: "FamiliaPostgresDatabase"})
        this.familiaRepository = this.connection.getDataSourcer().getRepository(FamiliaEntity);
        this.dificuldadeRepository = this.connection.getDataSourcer().getRepository(DificuldadeEntity);
        this.comunidadeRepository = this.connection.getDataSourcer().getRepository(ComunidadeEntity);
        this.familiaDificuldadeRepository = this.connection.getDataSourcer().getRepository(FamiliaDificuldadeEntity);
    }
    
    public async saveFamiliaDificuldade(dto: AssociarFamiliaComDificuldadeDTO[]): Promise<void> {
        try {
            const familiaDificuldade = dto.map(item => new FamiliaDificuldadeEntity(item.idFamilia, item.idDificuldade, item.outros, null, null));
            await this.unitOfWork.transactionMany(FamiliaDificuldadeEntity, familiaDificuldade);
        } catch (e: any) {
            this.logger.error({err: e.message}, "Erro ao persistir Familia Dificuldade")
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }

    public async save(dto: CadastrarFamiliaDTO): Promise<FamiliaCadastradaDTO> {
        try {
            const familia = await this.unitOfWork.transaction(FamiliaEntity, FamiliaMapper.toFamiliaEntity(dto));
            return new FamiliaCadastradaDTO(familia.id);
        } catch (e: any) {
            this.logger.error({err: e.message}, "Erro ao persistir Familia")
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }

    public async findComunidades(): Promise<ComunidadeDTO[]> {
        const listComunidades = await this.comunidadeRepository.find();
        return FamiliaMapper.toListComunidadeDTO(listComunidades);
    }

    public async findFamilias(): Promise<any> {
        return this.familiaRepository.find({relations: {dificuldades: true, ajudasRecebidas: true}});
    }

    public async findDificuldades(): Promise<DificuldadeDTO[]> {
        const listDificuldades = await this.dificuldadeRepository.find();
        return FamiliaMapper.toListDifilculdadeDTO(listDificuldades);
    }

    public async findFamiliaById(idFamilia: number): Promise<FamiliaEntity | null> {
        return this.familiaRepository.findOne({ where: { id: idFamilia }});
    }
}