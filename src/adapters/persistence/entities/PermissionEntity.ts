import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { User } from "./UserEntity";
import { RoleEntity } from "./RoleEntity";

@Entity('TPS_PERMISSIONS')
export class PermissionEntity {
    @PrimaryGeneratedColumn({ name: 'id_permission' })
    id: number;

    @Column({name: 'action'})
    action: string;

    @ManyToOne(() => RoleEntity, (r) => r.permissions)
    @JoinColumn({ name: 'role_id' })
    role: RoleEntity;

    @ManyToOne(() => User, (u) => u.permissions)
    @JoinColumn({ name: 'user_id' })
    user: User;

    constructor(
        id: number,
        action: string,
        role: RoleEntity,
        user: User
    ) {
        this.id = id;
        this.action = action;
        this.role = role;
        this.user = user;
    }
}