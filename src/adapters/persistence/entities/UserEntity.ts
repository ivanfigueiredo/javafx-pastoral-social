import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { SecurityEntity } from "./SecurityEntity";
import { RoleEntity } from "./RoleEntity";
import { AuditoriaEntity } from "./AuditoriaEntity";

@Entity('tps_users', {schema: 'usuario'})
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'user_id', type: "int4" })
  id: number;

  @Column({ name: 'nick_name', type: 'varchar', nullable: false })
  nickName: string;

  @Column({ name: 'name', type: 'varchar', nullable: false })
  nome: string;

  @Column({ name: 'password', type: 'varchar', nullable: false })
  password: string;

  @Column({ name: 'telefone', type: 'varchar', nullable: true })
  telefone: string | null;

  @Column({ name: 'is_coordenador', type: 'boolean', nullable: false, default: false })
  isCoordenador: boolean | null;

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
    telefone: string | null,
    isCoordenador: boolean | null,
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
    this.telefone = telefone;
    this.isCoordenador = isCoordenador;
  }
}