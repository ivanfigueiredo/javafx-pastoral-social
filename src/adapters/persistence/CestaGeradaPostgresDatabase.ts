import { Logger } from "pino";
import { CestaGeradaRepository } from "../../application/port/out/CestaGeradaRepository";
import { CestaGeradaEntity } from "./entities/CestaGeradaEntity";
import { UnitOfWork } from "./unitOfWork/UnitOfWork";
import { InternalServerErrorException } from "../../application/exceptions/InternalServerErrorException";
import { Connection } from "./database/Connection";
import { Repository } from "typeorm";
import { CestaFilterQueryDTO } from "../../application/dto/CestaFilterQueryDTO";
import { StatusCesta, StatusCestaEnum } from "../../application/dto/enuns/StatusCestaEnum";

export class CestaGeradaPostgresDatabase implements CestaGeradaRepository {
    private readonly cestaRepository: Repository<CestaGeradaEntity>;
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private connection: Connection,
        private readonly unitOfWork: UnitOfWork
    ) {
        this.logger = logger.child({service: "CestaGeradaPostgresDatabase"});
        this.cestaRepository = connection.getDataSourcer().getRepository(CestaGeradaEntity);
    }

    public async save(cesta: CestaGeradaEntity): Promise<void> {
        try {
            await this.unitOfWork.transaction(CestaGeradaEntity, cesta);
        } catch (e: any) {
            this.logger.error({err: e.message}, "Erro ao salvar cestas");
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }

    public async findCestaById(id: number): Promise<CestaGeradaEntity | null> {
        return this.cestaRepository.findOne({ where: { id } })
    }

    public async filterCestas(filter: CestaFilterQueryDTO): Promise<[CestaGeradaEntity[], number]> {
        try {
            const { page, pageSize, statusCesta } = filter;
            return this.cestaRepository.findAndCount({
                skip: (page - 1) * pageSize,
                take: pageSize,
                order: { id: "ASC" },
                where: {status: {id: StatusCesta[statusCesta]}},
                relations: {template: {acoes: {itensTemplate: {estoque: {itemProduto: {unidadeMedida: true}}}}}, status: true}
            });
        } catch (e: any) {
            this.logger.error({err: e.message}, "Erro ao consultar cestas");
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }

    public async countCestasEntregue(): Promise<number> {
        return this.cestaRepository.count({where: {status: {id: StatusCestaEnum.ENTREGUE}}});
    }
}