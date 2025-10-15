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

export class AssociarFamiliaAjudaService implements AssociarFamiliaAjudaUseCase {
    private readonly logger: Logger;

    constructor(
        logger: Logger,
        private readonly ajudaRepository: AjudaRepository,
        private readonly cestaGeradaRepository: CestaGeradaRepository,
        private readonly familiaRepository: FamiliaRepository
    ) {
        this.logger = logger.child({ service: 'AssociarFamiliaAjudaUseCase' });
    }

    public async execute(dto: AssociarAjudaFamiliaDTO[]): Promise<void> {
        this.logger.info('Iniciando fluxo de associacao da ajuda para familia');
        try {
            for (const ajuda of dto) {
                this.logger.info({idFamilia: ajuda.idFamilia}, 'Buscando familia pelo id');
                const familia = await this.familiaRepository.findFamiliaById(ajuda.idFamilia);
                if (!familia) throw new NotFoundException('Familia não encontrada.');
                this.logger.info({idCesta: ajuda.idCesta}, 'Buscando cesta pelo id');
                const cesta = await this.cestaGeradaRepository.findCestaById(ajuda.idCesta);
                if (!cesta) throw new NotFoundException('Cesta não encontrada.');
                const tipoAjuda = new TipoAjudaEntity(TipoAjudaEnum.CESTA_BASICA, null, []);
                const ajudaRecebida = new AjudaRecebidaEntity(null, null, false, false, null, null, familia, tipoAjuda, cesta);
                cesta.status = new StatusCestaEntity(StatusCestaEnum.RESERVADA, null, []);
                this.logger.info({ statusCesta: StatusCestaEnum.RESERVADA }, 'Atualizando status da cesta para: ');
                await this.cestaGeradaRepository.save(cesta);
                this.logger.info('Salvando ajuda');
                await this.ajudaRepository.criarAjuda([ajudaRecebida]);
            }
        } catch (e: any) {
            this.logger.error({err: e.getMessage()}, 'Erro ao associar familia a ajuda');
            if (e instanceof NotFoundException) {
                throw e;
            }
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.");
        }
    }
}