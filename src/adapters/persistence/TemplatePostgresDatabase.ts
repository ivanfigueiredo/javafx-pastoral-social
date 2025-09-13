import { Repository } from "typeorm";
import { TemplateRepository } from "../../application/port/out/TemplateRepository";
import { TemplateEntity } from "./entities/TemplateEntity";
import { Connection } from "./database/Connection";

export class TemplatePostgresDatabase implements TemplateRepository {
    private readonly templateRepository: Repository<TemplateEntity>;

    constructor(private readonly connection: Connection) {
        this.templateRepository = this.connection.getDataSourcer().getRepository(TemplateEntity);
    }

    public async findTemplateById(templateId: number): Promise<TemplateEntity | null> {
        return this.templateRepository.findOne({where: {id: templateId}});
    }
}