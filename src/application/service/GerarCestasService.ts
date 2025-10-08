import { Logger } from "pino";
import { GerarCestasDTO } from "../dto/GerarCestasDTO";
import { GerarCestasUseCase } from "../port/in/GerarCestasUseCase";
import { TemplateRepository } from "../port/out/TemplateRepository";
import { NotFoundException } from "../exceptions/NotFoundException";
import { TemplateItemDTO } from "../dto/TemplateItemDTO";
import { EstoqueUseCase } from "../port/in/EstoqueUseCase";
import { ConsultaGeracaoTemplateDTO } from "../dto/ConsultaGeracaoTemplateDTO";
import { UnprocessableException } from "../exceptions/UnprocessableException";
import { CestaGeradaRepository } from "../port/out/CestaGeradaRepository";
import { CestaGeradaEntity } from "../../adapters/persistence/entities/CestaGeradaEntity";
import { StatusCestaEnum } from "../dto/enuns/StatusCestaEnum";
import { StatusCestaEntity } from "../../adapters/persistence/entities/StatusCestaEntity";
import { InternalServerErrorException } from "../exceptions/InternalServerErrorException";

export class GerarCestasService implements GerarCestasUseCase {
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly templateRepository: TemplateRepository,
        private readonly cestaGeradaRepository: CestaGeradaRepository,
        private readonly estoqueUseCase: EstoqueUseCase,
    ) {
        this.logger = logger.child({ service: 'GerarCestasUseCase' });
    }

    public async execute(dto: GerarCestasDTO): Promise<void> {
        try {
            const template = await this.templateRepository.findTemplateById(dto.idTemplate);
            if (!template || template.acoes.length === 0) throw new NotFoundException('Template não cadastrado.');
            const result = template.acoes
                .map(acao => acao.itensTemplate)
                .flatMap(itensTemplate => itensTemplate.filter(item => item))
                .map(item => ({
                    itemProdutoId: item.estoque.itemProduto.id,
                    quantidade: item.acaoSocialTemplate.quantidade,
                })) as TemplateItemDTO[];
            const consultaGeracaoTemplate = new ConsultaGeracaoTemplateDTO(result);
            const qtdGeracaoCestas = await this.estoqueUseCase.consultarGeracaoTemplate(consultaGeracaoTemplate);
            if (qtdGeracaoCestas.quantidadePossivel <= 0) throw new UnprocessableException('O template informado é invalio ou estoque insuficiente para gerar o modelo.');
            const cestasGeracao: CestaGeradaEntity[] = [];
            for (let i = 0; i < qtdGeracaoCestas.quantidadePossivel; i++) {
                const statusCesta = new StatusCestaEntity(StatusCestaEnum.CRIADA, null, []);
                const cestaGerada = new CestaGeradaEntity(
                    null,
                    new Date(),
                    template,
                    statusCesta,
                    []
                );
                this.logger.info('Gerando cestas');
                cestasGeracao.push(cestaGerada);
            }
            await this.cestaGeradaRepository.saveMany(cestasGeracao);
        } catch (e: any) {
            this.logger.error({ err: e.getMessage }, 'Erro ao gerar cestas ');
            if (e instanceof NotFoundException || e instanceof UnprocessableException) {
                throw e;
            }
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.");
        }
    }
}