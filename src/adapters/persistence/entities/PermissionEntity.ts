import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { UserEntity } from "./UserEntity";
import { RoleEntity } from "./RoleEntity";

@Entity('tps_permissions')
export class PermissionEntity {
    @PrimaryGeneratedColumn({ name: 'id_permission' })
    id: number;

    @Column({name: 'action', type: 'varchar'})
    action: string;

    @ManyToOne(() => RoleEntity, (r) => r.permissions)
    @JoinColumn({ name: 'role_id' })
    role: RoleEntity;

    @ManyToOne(() => UserEntity, (u) => u.permissions)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    constructor(
        id: number,
        action: string,
        role: RoleEntity,
        user: UserEntity
    ) {
        this.id = id;
        this.action = action;
        this.role = role;
        this.user = user;
    }
}