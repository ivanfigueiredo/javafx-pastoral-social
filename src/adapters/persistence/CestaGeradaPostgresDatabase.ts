import { Logger } from "pino";
import { CestaGeradaRepository } from "../../application/port/out/CestaGeradaRepository";
import { CestaGeradaEntity } from "./entities/CestaGeradaEntity";
import { UnitOfWork } from "./unitOfWork/UnitOfWork";
import { InternalServerErrorException } from "../../application/exceptions/InternalServerErrorException";
import { Connection } from "./database/Connection";
import { Repository } from "typeorm";
import { CestaFilterQueryDTO } from "../../application/dto/CestaFilterQueryDTO";
import { StatusCestaEnum } from "../../application/dto/enuns/StatusCestaEnum";
import { TemplateTypeEnum } from "./entities/TemplateTypeEnum";

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

    public async save(cesta: CestaGeradaEntity): Promise<CestaGeradaEntity> {
        try {
            return await this.unitOfWork.transaction(CestaGeradaEntity, cesta);
        } catch (e: any) {
            this.logger.error({err: e.message}, "Erro ao salvar cestas");
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }

    public async findCestaById(id: number): Promise<CestaGeradaEntity | null> {
        return this.cestaRepository.findOne({ 
            where: { id },
            relations: {cestaItens: {cestaEstoqueItem: true}, ajuda: true}
        })
    }

    public async filterCestas(filter: CestaFilterQueryDTO): Promise<[CestaGeradaEntity[], number]> {
        try {
            this.logger.info({id: filter.statusCesta}, 'ID status cesta ')
            const { page, pageSize, statusCesta } = filter;
            return this.cestaRepository.findAndCount({
                skip: (page - 1) * pageSize,
                take: pageSize,
                order: { id: "DESC" },
                where: {status: {id: statusCesta}},
                relations: {cestaItens: {cestaEstoqueItem: {itemProduto: {unidadeMedida: true}}}, template: {itensTemplate: {itemProduto: true}}, status: true}
            });
        } catch (e: any) {
            this.logger.error({err: e.message}, "Erro ao consultar cestas");
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }

    public async countCestasEntregue(): Promise<number> {
        return this.cestaRepository.count({where: {status: {id: StatusCestaEnum.ENTREGUE}}});
    }

    public async findCestasByIdTemplate(idTemplate: number): Promise<CestaGeradaEntity[]> {
        return this.cestaRepository.find({where: {template: {id: idTemplate, templateType: TemplateTypeEnum.CESTA_BASICA}, status: {id: StatusCestaEnum.CRIADA}}});
    }
}