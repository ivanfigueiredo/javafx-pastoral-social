import { Role } from "./Permission";

export interface RolePermissionsOutput {
    tr_role_desc: Role; 
    tp_action: string;
}

export interface RoleRepository {
    findPermissions: () => Promise<RolePermissionsOutput[]>;
}