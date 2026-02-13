import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { RolePermissionsEntity } from "./RolePermissionsEntity";
import { UserEntity } from "./UserEntity";

@Entity('tps_roles', {schema: 'permissao'})
export class RoleEntity {
  @PrimaryGeneratedColumn({ name: 'role_id', type: "int4" })
  id: number;

  @Column({ name: 'role_desc', type: 'varchar' })
  description: string;

  @OneToMany(() => RolePermissionsEntity, (p) => p.rolePermission)
  rolePermissions: RolePermissionsEntity[] = [];

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[] = [];

  constructor(
    id: number,
    description: string,
    users: UserEntity[],
    rolePermissions: RolePermissionsEntity[]
  ) {
    this.id = id;
    this.description = description;
    this.users = users;
    this.rolePermissions = rolePermissions;
  }
}