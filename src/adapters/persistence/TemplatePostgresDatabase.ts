import { Repository } from "typeorm";
import { TemplateRepository } from "../../application/port/out/TemplateRepository";
import { TemplateEntity } from "./entities/TemplateEntity";
import { Connection } from "./database/Connection";
import { CriarTemplateDTO } from "../../application/dto/CriarTemplateDTO";

export class TemplatePostgresDatabase implements TemplateRepository {
    private readonly templateRepository: Repository<TemplateEntity>;

    constructor(private readonly connection: Connection) {
        this.templateRepository = this.connection.getDataSourcer().getRepository(TemplateEntity);
    }

    public async findTemplateById(templateId: number): Promise<TemplateEntity | null> {
        return this.templateRepository.findOne({where: {id: templateId}});
    }

    public async save(dto: CriarTemplateDTO): Promise<TemplateEntity> {
        const output = await this.templateRepository.save(new TemplateEntity(null, dto.templateDesc, dto.templateType, []));
        return output;
    }
}