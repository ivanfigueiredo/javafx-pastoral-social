import { Logger } from "pino";
import { Action } from "../../adapters/http/authorization/Permission";
import { UserLogged } from "../../adapters/http/types/express";
import { AuditoriaEntity } from "../../adapters/persistence/entities/AuditoriaEntity";
import { StatusOperacaoEnum } from "../../adapters/persistence/entities/StatusOperacaoEnum";
import { UserEntity } from "../../adapters/persistence/entities/UserEntity";
import { GeracaoModeloTemplateDTO } from "../dto/GeracaoModeloTemplateDTO";
import { ModeloTemplateCriadoResponse } from "../dto/ModeloTemplateCriadoResponseDTO";
import { AuditProxy } from "../port/in/AuditProxy";
import { EstoqueUseCase } from "../port/in/EstoqueUseCase";
import { AuditoriaRepository } from "../port/out/AuditoriaRepository";

export class GerarModeloTemplateProxy implements AuditProxy<GeracaoModeloTemplateDTO, ModeloTemplateCriadoResponse> {
    constructor(
        private readonly logger: Logger,
        private readonly estoqueUsecase: EstoqueUseCase,
        private readonly auditoriaRepository: AuditoriaRepository
    ) {}

    public async execute(dto: GeracaoModeloTemplateDTO, action: Action, userLogged: UserLogged): Promise<ModeloTemplateCriadoResponse> {
        const user = new UserEntity(userLogged.userId, userLogged.nickName, userLogged.nome, '', null, [], []);
        const auditoriaEntity = new AuditoriaEntity(null, null, null, action.valueOf(), user, dto, null, StatusOperacaoEnum.SUCESSO, new Date());
        try {
            const result = await this.estoqueUsecase.gerarModeloTemplate(dto);
            await this.auditoriaRepository.registrarAuditoria(auditoriaEntity);
            this.logger.info({action: action.valueOf()}, `Operacao ${action.valueOf()} registrado com sucesso.`);
            return result;
        } catch (e: any) {
            const auditoriaEntity = new AuditoriaEntity(null, null, null, action.valueOf(), user, dto, null, StatusOperacaoEnum.FALHA, new Date());
            await this.auditoriaRepository.registrarAuditoria(auditoriaEntity);
            throw e;
        }
    }
}