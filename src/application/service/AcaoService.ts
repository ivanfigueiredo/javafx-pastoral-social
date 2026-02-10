import { Logger } from "pino";
import { CadastrarAcaoDTO } from "../dto/CadastrarAcaoDTO";
import { TipoAcaoEnum } from "../dto/enuns/TipoAcaoEnum";
import { AcaoUseCase } from "../port/in/AcaoUseCase";
import { EstoqueUseCase } from "../port/in/EstoqueUseCase";
import { TemplateTypeEnum } from "../dto/enuns/TemplateTypeEnum";
import { AcaoEntity } from "../../adapters/persistence/entities/AcaoEntity";
import { TemplateEntity } from "../../adapters/persistence/entities/TemplateEntity";
import { AcaoRepository } from "../port/out/AcaoRepository";
import { UnitOfWorkPort } from "../port/out/UnitOfWorkPort";
import { InternalServerErrorException } from "../exceptions/InternalServerErrorException";
import { UnprocessableException } from "../exceptions/UnprocessableException";

export class AcaoService implements AcaoUseCase {
    private readonly logger: Logger;

    constructor(
        private readonly estoqueUseCase: EstoqueUseCase,
        private readonly acaoRepository: AcaoRepository,
        private readonly unitOfwork: UnitOfWorkPort,
        logger: Logger,
    ) {
        this.logger = logger.child({ service: "AcaoUseCase" });
    }

    public async cadastrarAcao(dto: CadastrarAcaoDTO): Promise<any> {
        try {
            await this.unitOfwork.startTransaction();
            const acao = new AcaoEntity(null, dto.titulo, dto.descricao, new Date(dto.dataEvento), new Date(), dto.tipoAcao.valueOf(), null, null, []);
            if (this.acaoIsValid(dto.tipoAcao)) {
                if (!dto.qtdAcaoSocial || dto.qtdAcaoSocial < 0) throw new UnprocessableException(`O campo qtdAcaoSocial precisa ser preenchido para tipo de ação: ${dto.tipoAcao}`);
                const tipoTemplate = (dto.tipoAcao === TipoAcaoEnum.CESTA_BASICA) ? TemplateTypeEnum.CESTA_BASICA : TemplateTypeEnum.ALMOCO;
                const templateCriado = await this.estoqueUseCase.criarModeloTemplateAcao(dto.itens!, tipoTemplate);
                const template = new TemplateEntity(templateCriado.idTemplate, null, null, [], [], null);
                acao.templateAcao = template;
                acao.qtdAcaoSocial = dto.qtdAcaoSocial;
            }
            await this.acaoRepository.salvarAcao(acao);
            await this.unitOfwork.commit();
            await this.unitOfwork.release();
        } catch (e: any) {
            this.logger.error({error: e.message}, 'Erro ao cadastrar acao');
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.")
        }
    }

    private acaoIsValid(tipoAcao: TipoAcaoEnum) {
        return tipoAcao === TipoAcaoEnum.CESTA_BASICA || tipoAcao === TipoAcaoEnum.JANTA;
    }
}