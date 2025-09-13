import { Repository } from "typeorm";
import { AcaoSocialTemplateRepository } from "../../application/port/out/AcaoSocialTemplateRepository";
import { Connection } from "./database/Connection";
import { AcaoSocialTemplateEntity } from "./entities/AcaoSocialTemplateEntity";
import { UnitOfWork } from "./unitOfWork/UnitOfWork";

export class AcaoSocialTemplatePostgresDatabase implements AcaoSocialTemplateRepository {
    private readonly acaoSocialTemplateRepository: Repository<AcaoSocialTemplateEntity>;
    
    constructor(
        private readonly connection: Connection,
        private readonly unitOfWork: UnitOfWork
    ) {
        this.acaoSocialTemplateRepository = this.connection.getDataSourcer().getRepository(AcaoSocialTemplateEntity);
    }

    public async save(acaoSocialTemplate: AcaoSocialTemplateEntity): Promise<void> {
        await this.unitOfWork.transaction(AcaoSocialTemplateEntity, acaoSocialTemplate);
    }
}