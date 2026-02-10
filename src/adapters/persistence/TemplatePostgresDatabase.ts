import { Repository } from "typeorm";
import { TemplateRepository } from "../../application/port/out/TemplateRepository";
import { TemplateEntity } from "./entities/TemplateEntity";
import { Connection } from "./database/Connection";
import { CriarTemplateDTO } from "../../application/dto/CriarTemplateDTO";
import { UnitOfWork } from "./unitOfWork/UnitOfWork";
import { Logger } from "pino";
import { InternalServerErrorException } from "../../application/exceptions/InternalServerErrorException";

export class TemplatePostgresDatabase implements TemplateRepository {
    private readonly templateRepository: Repository<TemplateEntity>;
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly connection: Connection,
        private readonly unitOfWork: UnitOfWork
    ) {
        this.logger = logger.child({service: "TemplatePostgresDatabase"})
        this.templateRepository = this.connection.getDataSourcer().getRepository(TemplateEntity);
    }

    public async findTemplateById(templateId: number): Promise<TemplateEntity | null> {
        return this.templateRepository.findOne({where: {id: templateId}, relations: {itensTemplate: {itemProduto: true}}});
    }

    public async save(dto: CriarTemplateDTO): Promise<TemplateEntity> {
        try {
            return await this.unitOfWork.transaction(TemplateEntity, new TemplateEntity(null, dto.templateDesc, dto.templateType, [], [], null));
        } catch (e: any) {
            this.logger.error({err: e.message}, "Erro ao persistir template")
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }

    public async findPaginatedTemplate(page: number, pageSize: number): Promise<[TemplateEntity[], number]> {
        const currentPage = (page && page > 1) ? page : 1;
        const currentPageSize = (pageSize && pageSize > 10) ? pageSize : 10;
        return this.templateRepository.findAndCount({
            skip: (currentPage - 1) * pageSize,
            take: currentPageSize,
            order: { id: "ASC" },
            relations: {itensTemplate: {itemProduto: true}}
        });
    }

    public async findTemplates(): Promise<TemplateEntity[]> {
        return this.templateRepository.find({relations: {cestas: {status: true}}});
    }
}