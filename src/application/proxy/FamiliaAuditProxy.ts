import { Action } from "../../adapters/http/authorization/Permission";
import { UserLogged } from "../../adapters/http/types/express";
import { AuditoriaEntity } from "../../adapters/persistence/entities/AuditoriaEntity";
import { StatusOperacaoEnum } from "../../adapters/persistence/entities/StatusOperacaoEnum";
import { UserEntity } from "../../adapters/persistence/entities/UserEntity";
import { CadastrarFamiliaDTO } from "../dto/CadastrarFamiliaDTO";
import { AuditProxy } from "../port/in/AuditProxy";
import { CadastrarFamiliaUseCase } from "../port/in/CadastrarFamiliaUseCase";
import { AuditoriaRepository } from "../port/out/AuditoriaRepository";

export class FamiliaAuditProxy implements AuditProxy<CadastrarFamiliaDTO, any> {
    constructor(
        private readonly cadastrarFamiliaUseCase: CadastrarFamiliaUseCase,
        private readonly auditoriaRepository: AuditoriaRepository
    ) {}

    public async execute(dto: CadastrarFamiliaDTO, action: Action, userLogged: UserLogged): Promise<any> {
        const user = new UserEntity(userLogged.userId, userLogged.nickName, '', null, [], []);
        const auditoriaEntity = new AuditoriaEntity(null, null, null, action.valueOf(), user, dto, null, StatusOperacaoEnum.SUCESSO, new Date());
        try {
            await this.cadastrarFamiliaUseCase.execute(dto);
            await this.auditoriaRepository.registrarAuditoria(auditoriaEntity);
        } catch (e) {
            const auditoriaEntity = new AuditoriaEntity(null, null, null, action.valueOf(), user, dto, null, StatusOperacaoEnum.FALHA, new Date());
            await this.auditoriaRepository.registrarAuditoria(auditoriaEntity);
            throw e;
        }
    }
}