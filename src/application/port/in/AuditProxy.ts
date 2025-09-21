import { Action } from "../../../adapters/http/authorization/Permission";
import { UserLogged } from "../../../adapters/http/types/express";
import { BaseDTO } from "../../dto/BaseDTO";

export interface AuditProxy<D extends BaseDTO = BaseDTO, T extends BaseDTO = BaseDTO> {
    execute(dto: D, action: Action, userLogged: UserLogged): Promise<T>;
}