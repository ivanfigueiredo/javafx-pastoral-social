import { AcaoSocialTemplateEntity } from "../../../adapters/persistence/entities/AcaoSocialTemplateEntity";

export interface AcaoSocialTemplateRepository {
    save: (templateAcaoSocial: AcaoSocialTemplateEntity) => Promise<void>;
}