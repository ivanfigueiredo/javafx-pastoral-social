import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { RoleEntity } from "./RoleEntity";
import { PermissionEntity } from "./PermissionEntity";

@Entity('tps_role_permissions', {schema: 'permissao'})
export class RolePermissionsEntity {
    @PrimaryColumn({ name: 'role_id', type: "int4" })
    roleId: number;

    @PrimaryColumn({ name: 'id_permission', type: "int4" })
    permissionId: number;
    
    @ManyToOne(() => RoleEntity, (r) => r.rolePermissions, {
        eager: true
    })
    @JoinColumn({ name: 'role_id' })
    rolePermission: RoleEntity;

    @ManyToOne(() => PermissionEntity, (p) => p.permissions, {
        eager: true
    })
    @JoinColumn({ name: 'id_permission' })
    permission: PermissionEntity;

    constructor(
        roleId: number,
        permissionId: number,
        rolePermission: RoleEntity,
        permission: PermissionEntity
    ) {
        this.roleId = roleId;
        this.permissionId = permissionId;
        this.rolePermission = rolePermission;
        this.permission = permission;
    }
}