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
import { TipoAjudaEnum } from "../../application/dto/enuns/TipoAjudaEnum";
import { TipoAjudaEntity } from "./entities/TipoAjudaEntity";

export class FamiliaPostgresDatabase implements FamiliaRepository {
    private readonly logger: Logger;
    private readonly familiaRepository: Repository<FamiliaEntity>;
    private readonly dificuldadeRepository: Repository<DificuldadeEntity>;
    private readonly comunidadeRepository: Repository<ComunidadeEntity>;
    private readonly familiaDificuldadeRepository: Repository<FamiliaDificuldadeEntity>;
    private readonly tipoAjudaRepository: Repository<TipoAjudaEntity>;

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
        this.tipoAjudaRepository = this.connection.getDataSourcer().getRepository(TipoAjudaEntity);
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

    public async findFamilias(): Promise<[FamiliaEntity[], number]> {
        return await this.familiaRepository.findAndCount({
            relations: {
                ajudasRecebidas: true,
                dificuldades: {
                    dificuldade: {
                        dificuldadeTipoAjuda: true
                    }
                }
            }
        });
    }

    public async findDificuldades(): Promise<DificuldadeDTO[]> {
        const listDificuldades = await this.dificuldadeRepository.find();
        return FamiliaMapper.toListDifilculdadeDTO(listDificuldades);
    }

    public async findFamiliaById(idFamilia: number): Promise<FamiliaEntity | null> {
        return this.familiaRepository.findOne({ where: { id: idFamilia }});
    }

    public async getFamiliasPorTipoAjuda(tipoAjuda: TipoAjudaEnum): Promise<FamiliaEntity[]> {
        const result = await this.tipoAjudaRepository.findOne({
            where: {id: tipoAjuda}, 
            relations: {
                tipoAjudaDificuldade: {
                    dificuldade: {
                        familias: {
                            familia: {
                                ajudasRecebidas: true, 
                                dificuldades: {
                                    dificuldade: { 
                                        dificuldadeTipoAjuda: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        if (!result) return [];
        return result.tipoAjudaDificuldade!.dificuldade!.familias.map(familiaDificuldade => familiaDificuldade.familia)
            .filter(familia => familia != null);
    }
}