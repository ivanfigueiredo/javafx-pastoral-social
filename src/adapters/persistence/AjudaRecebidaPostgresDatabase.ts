import { Repository } from "typeorm";
import { AjudaRepository } from "../../application/port/out/AjudaRepository";
import { AjudaRecebidaEntity } from "./entities/AjudaRecebidaEntity";
import { Connection } from "./database/Connection";
import { Logger } from "pino";
import { InternalServerErrorException } from "../../application/exceptions/InternalServerErrorException";
import { UnitOfWork } from "./unitOfWork/UnitOfWork";
import { AjudaFilterQueryDTO } from "../../application/dto/AjudaFilterQueryDTO";
import { OpcaoListaDTO } from "../../application/dto/OpcaoListaDTO";
import { TipoAjudaEntity } from "./entities/TipoAjudaEntity";
import { AjudaMapper } from "../mappers/AjudaMapper";

export class AjudaRecebidaPostgresDatabase implements AjudaRepository {
    private readonly ajudaRepository: Repository<AjudaRecebidaEntity>;
    private readonly tipoAjudaRepository: Repository<TipoAjudaEntity>;
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly connection: Connection,
        private readonly unitOfWork: UnitOfWork
    ) {
        this.logger = logger.child({ service: 'AjudaRepository' });
        this.ajudaRepository = connection.getDataSourcer().getRepository(AjudaRecebidaEntity);
        this.tipoAjudaRepository = connection.getDataSourcer().getRepository(TipoAjudaEntity);
    }

    public async criarAjuda(ajudas: AjudaRecebidaEntity[]): Promise<void> {
        try {
            await this.unitOfWork.transactionMany(AjudaRecebidaEntity, ajudas)
        } catch(e: any) {
            this.logger.error({err: e.message}, 'Error ao persistir ajuda');
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }

    public async save(ajuda: AjudaRecebidaEntity): Promise<void> {
        try {
            await this.unitOfWork.transaction(AjudaRecebidaEntity, ajuda);
        } catch(e: any) {
            this.logger.error({err: e.message}, 'Error ao persistir ajuda');
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }

    public async findAjudaById(idAjuda: number): Promise<AjudaRecebidaEntity | null> {
        return this.ajudaRepository.findOne({where: {id: idAjuda}, relations: {cestaGerada: true}})
    }

    public async findAjudas(filter: AjudaFilterQueryDTO): Promise<[AjudaRecebidaEntity[], number]> {
        try {
            const { page, pageSize, statusAjuda } = filter;
            const query = this.ajudaRepository.createQueryBuilder("ajuda")
                .leftJoinAndSelect("ajuda.tipoAjuda", "tipoAjuda")
                .leftJoinAndSelect("ajuda.cestaGerada", "cestaGerada")
                .leftJoinAndSelect("cestaGerada.cestaItens", "cestaItens")
                .leftJoinAndSelect("cestaGerada.template", "template")
                .leftJoinAndSelect("template.itensTemplate", "itensTemplate")
                .leftJoinAndSelect("itensTemplate.itemProduto", "itemProduto")
                .leftJoinAndSelect("itemProduto.unidadeMedida", "unidadeMedida")
                .leftJoinAndSelect("ajuda.familia", "familia")
                .where("ajuda.statusAjuda = :statusAjuda", { statusAjuda })
                .orderBy("ajuda.id", "DESC")
                .skip((page - 1) * pageSize)
                .take(pageSize);
            if (filter.tipoAjuda) {
                query.andWhere("tipoAjuda.id = :idTipoAjuda", { idTipoAjuda: filter.tipoAjuda });   
            }
            if (filter.dataInicio) {
                query.andWhere("ajuda.dataEntrega >= :dataInicio", { dataInicio: filter.dataInicio });
            }
            if (filter.dataFim) {
                query.andWhere("ajuda.dataEntrega <= :dataFim", { dataFim: filter.dataFim });
            }
            return await query.getManyAndCount();
        } catch (e: any) {
            this.logger.error({err: e.message}, "Erro ao consultar cestas");
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }

    public async findAjudasOpcaoLista(): Promise<OpcaoListaDTO[]> {
        const tiposAjuda = await this.tipoAjudaRepository.find();
        return AjudaMapper.toTipoAjudaOpcaoListaDTO(tiposAjuda);
    }
}