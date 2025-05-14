import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PermissionEntity } from "./PermissionEntity";
import { SecurityEntity } from "./SecurityEntity";

@Entity('TPS_USERS')
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number;

  @Column({ name: 'nick_name', type: 'varchar', nullable: false })
  nickName: string;

  @Column({ name: 'password', type: 'varchar', nullable: false })
  password: string;

  @OneToMany(() => PermissionEntity, (p) => p.user)
  permissions: PermissionEntity[];

  @OneToMany(() => SecurityEntity, (t) => t.user)
  security: SecurityEntity[];

  constructor(
    id: number,
    nickName: string,
    password: string,
    permissions: PermissionEntity[],
    security: SecurityEntity[]
  ) {
    this.id = id;
    this.nickName = nickName;
    this.password = password;
    this.permissions = permissions;
    this.security = security;
  }
}