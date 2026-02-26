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
            return this.ajudaRepository.findAndCount({
                skip: (page - 1) * pageSize,
                take: pageSize,
                order: { id: "DESC" },
                where: { statusAjuda: statusAjuda, tipoAjuda: {id: filter?.tipoAjuda} },
                relations: {tipoAjuda: true, cestaGerada: {cestaItens: true}, familia: true}
            });
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