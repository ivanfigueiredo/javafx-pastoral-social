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
import { EstoqueRepository } from "../port/out/EstoqueRepository";
import { CestaEstoqueItemEntity } from "../../adapters/persistence/entities/CestaEstoqueItemEntity";
import { CestaEstoqueItemRepository } from "../port/out/CestaEstoqueItemRepository";
import { UnitOfWorkPort } from "../port/out/UnitOfWorkPort";

export class GerarCestasService implements GerarCestasUseCase {
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly templateRepository: TemplateRepository,
        private readonly cestaGeradaRepository: CestaGeradaRepository,
        private readonly estoqueRepository: EstoqueRepository,
        private readonly cestaEstoqueItemRepository: CestaEstoqueItemRepository,
        private readonly estoqueUseCase: EstoqueUseCase,
        private readonly unitOfWork: UnitOfWorkPort
    ) {
        this.logger = logger.child({ service: 'GerarCestasUseCase' });
    }

    public async execute(dto: GerarCestasDTO): Promise<void> {
        try {
            await this.unitOfWork.startTransaction();
            const template = await this.templateRepository.findTemplateById(dto.idTemplate);
            if (!template || template.itensTemplate.length === 0) throw new NotFoundException('Template não cadastrado.');
            const result = template.itensTemplate.map(item => ({
                itemProdutoId: item.itemProduto.id,
                quantidade: item.quantidade,
            })) as TemplateItemDTO[];
            const consultaGeracaoTemplate = new ConsultaGeracaoTemplateDTO(result);
            const qtdGeracaoCestas = await this.estoqueUseCase.consultarGeracaoTemplate(consultaGeracaoTemplate);
            if (qtdGeracaoCestas.quantidadePossivel <= 0) throw new UnprocessableException('O template informado é invalio ou estoque insuficiente para gerar o modelo.');
            for (let i = 0; i < qtdGeracaoCestas.quantidadePossivel; i++) {
                const statusCesta = new StatusCestaEntity(StatusCestaEnum.CRIADA, null, []);
                let cesta = new CestaGeradaEntity(null, new Date(), template, statusCesta, [], null);
                this.logger.info('Gerando cestas');
                cesta = await this.cestaGeradaRepository.save(cesta);
                for (const templateItem of result) {
                    const qtdNecessarioTotal = templateItem.quantidade;
                    const estoqueItens = await this.estoqueRepository.findEstoqueByItemProdutoIdAndQtdGeracaoTemplate(templateItem.itemProdutoId, qtdNecessarioTotal);
                    let cestaEstoqueItem: CestaEstoqueItemEntity;
                    for (const estoque of estoqueItens) {
                        estoque.dataSaida = new Date();
                        estoque.isDisponivel = false;
                        cestaEstoqueItem = new CestaEstoqueItemEntity(cesta.id!, estoque.id!, estoque, cesta);
                        await this.cestaEstoqueItemRepository.save(cestaEstoqueItem);
                    }
                    await this.estoqueRepository.saveMany(estoqueItens);
                }
            }
            await this.unitOfWork.commit();
        } catch (e: any) {
            this.logger.error({ err: e.message }, 'Erro ao gerar cestas ');
            await this.unitOfWork.rollBack();
            if (e instanceof NotFoundException || e instanceof UnprocessableException) {
                throw e;
            }
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.");
        } finally {
            await this.unitOfWork.release();
        }
    }
}