import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PermissionEntity } from "./PermissionEntity";

@Entity('tps_roles')
export class RoleEntity {
  @PrimaryGeneratedColumn({ name: 'role_id' })
  id: number;

  @Column({ name: 'role_desc', type: 'varchar' })
  description: string;

  @OneToMany(() => PermissionEntity, (p) => p.role)
  permissions: PermissionEntity[];

  constructor(
    id: number,
    description: string,
    permissions: PermissionEntity[]
  ) {
    this.id = id;
    this.description = description;
    this.permissions = permissions;
  }
}