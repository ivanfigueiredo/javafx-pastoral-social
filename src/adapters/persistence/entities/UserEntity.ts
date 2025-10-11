import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { SecurityEntity } from "./SecurityEntity";
import { RoleEntity } from "./RoleEntity";
import { AuditoriaEntity } from "./AuditoriaEntity";

@Entity('tps_users')
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number;

  @Column({ name: 'nick_name', type: 'varchar', nullable: false })
  nickName: string;

  @Column({ name: 'name', type: 'varchar', nullable: false })
  nome: string;

  @Column({ name: 'password', type: 'varchar', nullable: false })
  password: string;

  @OneToMany(() => SecurityEntity, (t) => t.user)
  security: SecurityEntity[] = [];

  @OneToMany(() => AuditoriaEntity, auditoria => auditoria.user)
  auditorias: AuditoriaEntity[] = [];

  @ManyToOne(() => RoleEntity, (r) => r.users, {
    eager: true
  })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity | null;

  constructor(
    id: number,
    nickName: string,
    nome: string,
    password: string,
    role: RoleEntity | null,
    security: SecurityEntity[],
    auditorias: AuditoriaEntity[]
  ) {
    this.id = id;
    this.nickName = nickName;
    this.nome = nome;
    this.password = password;
    this.role = role;
    this.security = security;
    this.auditorias = auditorias;
  }
}