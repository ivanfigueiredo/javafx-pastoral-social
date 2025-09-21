import { InternalServerErrorException } from "../../application/exceptions/InternalServerErrorException";
import { AcaoSocialTemplateRepository } from "../../application/port/out/AcaoSocialTemplateRepository";
import { AcaoSocialTemplateEntity } from "./entities/AcaoSocialTemplateEntity";
import { UnitOfWork } from "./unitOfWork/UnitOfWork";
import { Logger } from "pino";

export class AcaoSocialTemplatePostgresDatabase implements AcaoSocialTemplateRepository {
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly unitOfWork: UnitOfWork
    ) {
        this.logger = logger.child({service: "AcaoSocialTemplatePostgresDatabase"})
    }

    public async save(acaoSocialTemplate: AcaoSocialTemplateEntity): Promise<AcaoSocialTemplateEntity> {
        try {
            return await this.unitOfWork.transaction(AcaoSocialTemplateEntity, acaoSocialTemplate);
        } catch (e: any) {
            this.logger.error({err: e.message}, "Erro ao persistir acoes sociais")
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }
}