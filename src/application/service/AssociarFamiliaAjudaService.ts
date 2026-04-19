import { Logger } from "pino";
import { AssociarAjudaFamiliaDTO } from "../dto/AssociarAjudaFamiliaDTO";
import { AssociarFamiliaAjudaUseCase } from "../port/in/AssociarFamiliaAjudaUseCase";
import { AjudaRepository } from "../port/out/AjudaRepository";
import { CestaGeradaRepository } from "../port/out/CestaGeradaRepository";
import { FamiliaRepository } from "../port/out/FamiliaRepository";
import { NotFoundException } from "../exceptions/NotFoundException";
import { InternalServerErrorException } from "../exceptions/InternalServerErrorException";
import { AjudaRecebidaEntity } from "../../adapters/persistence/entities/AjudaRecebidaEntity";
import { TipoAjudaEntity } from "../../adapters/persistence/entities/TipoAjudaEntity";
import { TipoAjudaEnum } from "../dto/enuns/TipoAjudaEnum";
import { StatusCestaEntity } from "../../adapters/persistence/entities/StatusCestaEntity";
import { StatusCestaEnum } from "../dto/enuns/StatusCestaEnum";
import { UnprocessableException } from "../exceptions/UnprocessableException";
import { UnitOfWorkPort } from "../port/out/UnitOfWorkPort";
import { StatusAjudaEnum } from "../../adapters/persistence/entities/StatusAjudaEnum";
import { FamiliaEntity } from "../../adapters/persistence/entities/FamiliaEntity";

export class AssociarFamiliaAjudaService implements AssociarFamiliaAjudaUseCase {
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly cestaGeradaRepository: CestaGeradaRepository,
        private readonly ajudaRepository: AjudaRepository,
        private readonly familiaRepository: FamiliaRepository,
        private readonly unitOfWork: UnitOfWorkPort
    ) {
        this.logger = logger.child({ service: 'AssociarFamiliaAjudaUseCase' });
    }

    public async execute(dto: AssociarAjudaFamiliaDTO[]): Promise<void> {
        this.logger.info('Iniciando fluxo de associacao da ajuda para familia');
        try {
            await this.unitOfWork.startTransaction();
            const familias = await this.familiaRepository.findFamiliasByIds(dto.map(item => item.idFamilia));
            if (familias.length !== dto.length) throw new NotFoundException('Uma ou mais familias não foram encontradas.');
            if (familias.length === 0) throw new NotFoundException('Nenhuma familia encontrada para os ids informados.');
            const ajudasDoada: AjudaRecebidaEntity[] = [];
            for (const item of dto) {
                if (!this.existeFamilia(familias, item.idFamilia)) throw new NotFoundException(`Familia com id ${item.idFamilia} não encontrada no payload.`);
                let ajudaRecebida: AjudaRecebidaEntity;
                const detalhe = JSON.stringify({detalhe: item.ajuda.observacao});
                const familia = familias.find(familia => familia.id === item.idFamilia)!;
                if (!familia) throw new NotFoundException('Familia não encontrada.');
                if (item.ajuda.tipoAjuda == TipoAjudaEnum.CESTA_BASICA) {
                    const cestas = await this.cestaGeradaRepository.findCestasByIdTemplate(item.ajuda.idTemplate);
                    if (cestas === null || cestas.length === 0) throw new UnprocessableException("O template informado não tem cestas disponíveis");
                    const cesta = cestas[0];
                    cesta.status = new StatusCestaEntity(StatusCestaEnum.RESERVADA, null, []);
                    await this.cestaGeradaRepository.save(cesta);
                    this.logger.info({ statusCesta: StatusCestaEnum.RESERVADA }, 'Atualizando status da cesta para: ');
                    const tipoAjuda = new TipoAjudaEntity(TipoAjudaEnum.CESTA_BASICA, null, null, []);
                    ajudaRecebida = new AjudaRecebidaEntity(null, null, false, false, StatusAjudaEnum.AGUARDANDO_APROVACAO, null, detalhe, this.getLocalDate(), familia, tipoAjuda, cesta);
                } else {
                    const tipoAjuda = new TipoAjudaEntity(item.ajuda.tipoAjuda, null, null, []);
                    ajudaRecebida = new AjudaRecebidaEntity(null, null, false, false, StatusAjudaEnum.AGUARDANDO_APROVACAO, null, detalhe, this.getLocalDate(), familia, tipoAjuda, null);
                }
                ajudasDoada.push(ajudaRecebida);
            }
            await this.ajudaRepository.criarAjuda(ajudasDoada);
            this.logger.info('Ajudas doadas salvas com sucesso.');
            await this.unitOfWork.commit();
        } catch (e: any) {
            this.logger.error({err: e.message}, 'Erro ao associar familia a ajuda');
            await this.unitOfWork.rollBack();
            if (e instanceof NotFoundException || e instanceof UnprocessableException) throw e;
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.");
        } finally {
            await this.unitOfWork.release();
        }
    }

    private existeFamilia(familias: FamiliaEntity[], idFamilia: number): boolean {
        return familias.some(familia => familia.id === idFamilia);
    }

    private getLocalDate(): string {
        const hoje = new Date();
        const dataLocal = new Date(
            hoje.getFullYear(),
            hoje.getMonth(),
            hoje.getDate()
        );
        return dataLocal.toISOString().split("T")[0];
    }
}