import { Logger } from "pino";
import { ListarTemplatesComCestasDisponiveisUseCase } from "../port/in/ListarTemplatesComCestasDisponiveisUseCase";
import { TemplateRepository } from "../port/out/TemplateRepository";
import { InternalServerErrorException } from "../exceptions/InternalServerErrorException";
import { NotFoundException } from "../exceptions/NotFoundException";
import { UnprocessableException } from "../exceptions/UnprocessableException";
import { ListarTemplatesComCestasDisponiveisDTO } from "../dto/ListarTemplatesComCestasDisponiveisDTO";
import { StatusCestaEnum } from "../dto/enuns/StatusCestaEnum";

export class ListarTemplatesComCestasDisponiveisService implements ListarTemplatesComCestasDisponiveisUseCase {
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly templateRepository: TemplateRepository
    ) {
        this.logger = logger.child({ service: 'ListarTemplatesComCestasDisponiveisUseCase' });
    }

    public async execute(): Promise<ListarTemplatesComCestasDisponiveisDTO[]> {
        try {
            const templates = await this.templateRepository.findTemplates();
            return templates.map(template => {
                const cestas = template.cestas.map(cesta => {
                    if (cesta.status.id === StatusCestaEnum.CRIADA) return cesta
                })
                .filter(cesta => (cesta != null || cesta != undefined))
                return  new ListarTemplatesComCestasDisponiveisDTO(
                    template.id!,
                    template.descricao!,
                    template.templateType!,
                    cestas.length ?? 0
                )
            }) as ListarTemplatesComCestasDisponiveisDTO[]
            
        } catch (e: any) {
            this.logger.error({err: e.message}, 'Erro ao associar familia a ajuda');
            if (e instanceof NotFoundException || e instanceof UnprocessableException) throw e;
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.");
        }
    }
    
}