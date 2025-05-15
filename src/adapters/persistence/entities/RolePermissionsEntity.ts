import { Entity, ManyToOne, JoinColumn, Column, PrimaryColumn } from "typeorm";
import { RoleEntity } from "./RoleEntity";
import { PermissionEntity } from "./PermissionEntity";

@Entity('tps_role_permissions')
export class RolePermissionsEntity {
    @PrimaryColumn({ name: 'role_id', type: 'int' })
    roleId: number;

    @PrimaryColumn({ name: 'id_permission', type: 'int' })
    permissionId: number;
    
    @ManyToOne(() => RoleEntity, (r) => r.rolePermissions)
    @JoinColumn({ name: 'role_id' })
    rolePermission: RoleEntity;

    @ManyToOne(() => PermissionEntity, (p) => p.permissions)
    @JoinColumn({ name: 'id_permission' })
    permission: PermissionEntity;

    @Column({ name: 'descricao_outros', type: 'varchar', nullable: true })
    descricaoOutros: string;

    constructor(
        roleId: number,
        permissionId: number,
        rolePermission: RoleEntity,
        permission: PermissionEntity,
        descricaoOutros: string
    ) {
        this.roleId = roleId;
        this.permissionId = permissionId;
        this.rolePermission = rolePermission;
        this.permission = permission;
        this.descricaoOutros = descricaoOutros;
    }
}