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

export class FamiliaPostgresDatabase implements FamiliaRepository {
    private readonly familiaRepository: Repository<FamiliaEntity>;
    private readonly dificuldadeRepository: Repository<DificuldadeEntity>;
    private readonly comunidadeRepository: Repository<ComunidadeEntity>;
    private readonly familiaDificuldadeRepository: Repository<FamiliaDificuldadeEntity>;

    constructor(private readonly connection: Connection) {
        this.familiaRepository = this.connection.getDataSourcer().getRepository(FamiliaEntity);
        this.dificuldadeRepository = this.connection.getDataSourcer().getRepository(DificuldadeEntity);
        this.comunidadeRepository = this.connection.getDataSourcer().getRepository(ComunidadeEntity);
        this.familiaDificuldadeRepository = this.connection.getDataSourcer().getRepository(FamiliaDificuldadeEntity);
    }
    
    public async saveFamiliaDificuldade(dto: AssociarFamiliaComDificuldadeDTO): Promise<void> {
        const familiaDificuldade = new FamiliaDificuldadeEntity(dto.idFamilia, dto.idDificuldade, dto.outros, null, null);
        await this.familiaDificuldadeRepository.save(familiaDificuldade);
    }

    public async save(dto: CadastrarFamiliaDTO): Promise<FamiliaCadastradaDTO> {
        try {
            const familia = await this.familiaRepository.save(FamiliaMapper.toFamiliaEntity(dto));
            return new FamiliaCadastradaDTO(familia.id);
        } catch (error) {
            throw new Error();
        }
    }

    public async findComunidades(): Promise<ComunidadeDTO[]> {
        const listComunidades = await this.comunidadeRepository.find();
        return FamiliaMapper.toListComunidadeDTO(listComunidades);
    }

    public async findFamilias(): Promise<any> {}

    public async findDificuldades(): Promise<DificuldadeDTO[]> {
        const listDificuldades = await this.dificuldadeRepository.find();
        return FamiliaMapper.toListDifilculdadeDTO(listDificuldades);
    }
}