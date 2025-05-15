import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { RolePermissionsEntity } from "./RolePermissionsEntity";

@Entity('tps_permissions')
export class PermissionEntity {
    @PrimaryGeneratedColumn({ name: 'id_permission' })
    id: number;

    @Column({name: 'action', type: 'varchar'})
    action: string;

    @OneToMany(() => RolePermissionsEntity, (p) => p.permission)
    permissions: RolePermissionsEntity[];

    constructor(
        id: number,
        action: string,
        permissions: RolePermissionsEntity[]
    ) {
        this.id = id;
        this.action = action;
        this.permissions = permissions;
    }
}