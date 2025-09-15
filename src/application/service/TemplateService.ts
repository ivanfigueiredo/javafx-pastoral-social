import { CriarTemplateDTO } from "../dto/CriarTemplateDTO";
import { TemplateCreatedDTO } from "../dto/TemplateCreatedDTO";
import { InternalServerErrorException } from "../exceptions/InternalServerErrorException";
import { TemplateUseCase } from "../port/in/TemplateUseCase";
import { TemplateRepository } from "../port/out/TemplateRepository";

export class TemplateService implements TemplateUseCase {
    constructor(private readonly templateRepository: TemplateRepository) {}

    public async criarTemplate(dto: CriarTemplateDTO): Promise<TemplateCreatedDTO> {
        const output = await this.templateRepository.save(dto);
        if (output.id == null) {
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
        return new TemplateCreatedDTO(output.id, output.descricao, output.templateType);
    }

    public async getDetalheTemplate(templateId: number): Promise<any> {
        throw new Error("Method not implemented.");
    }

    public async listarTemplates(): Promise<any> {
        throw new Error("Method not implemented.");
    }
}