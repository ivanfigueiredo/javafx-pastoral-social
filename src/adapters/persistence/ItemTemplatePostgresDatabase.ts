import { Repository } from "typeorm";
import { TemplateItemDTO } from "../../application/dto/TemplateItemDTO";
import { InternalServerErrorException } from "../../application/exceptions/InternalServerErrorException";
import { ItemTemplateRepository } from "../../application/port/out/ItemTemplateRepository";
import { ItemTemplateEntity } from "./entities/ItemTemplateEntity";
import { TemplateEntity } from "./entities/TemplateEntity";
import { UnitOfWork } from "./unitOfWork/UnitOfWork";
import { Logger } from "pino";
import { Connection } from "./database/Connection";
import { TemplateTypeEnum } from "../../application/dto/enuns/TemplateTypeEnum";

export class ItemTemplatePostgresDatabase implements ItemTemplateRepository {
    private readonly logger: Logger;
    private repository: Repository<ItemTemplateEntity>;

    constructor(
        logger: Logger,
        private readonly unitOfWork: UnitOfWork,
        private readonly connection: Connection
    ) {
        this.logger = logger.child({service: "ItemTemplatePostgresDatabase"})
        this.repository = this.connection.getDataSourcer().getRepository(ItemTemplateEntity);
    }

    public async save(itemTemplate: ItemTemplateEntity): Promise<ItemTemplateEntity> {
        try {
           return await this.unitOfWork.transaction(ItemTemplateEntity, itemTemplate);
        } catch (e: any) {
            this.logger.error({err: e.message}, "Erro ao persistir itens template")
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }
    
    public async existeTemplateByItens(templateItens: TemplateItemDTO[], tipoTemplate: TemplateTypeEnum): Promise<TemplateEntity | null> {
        const result = await this.repository.createQueryBuilder('tit')
            .leftJoinAndSelect('tit.template', 't')
            .select("tit.id_template", "id_template")
            .where("tit.id_item_produto IN (:...itemIds)", { itemIds: templateItens.map((item) => item.itemProdutoId) })
            .andWhere("tit.quantidade IN (:...quantidades)", { quantidades: templateItens.map((item) => item.quantidade) })
            .andWhere("t.templateType = :templateType", { templateType: tipoTemplate })
            .groupBy("tit.id_template")
            .having("COUNT(DISTINCT tit.id_item_produto) = :count", { count: templateItens.length })
            .getRawOne();
        return result ? new TemplateEntity(result.id_template, null, null, [], [], null) : null;
    }
}