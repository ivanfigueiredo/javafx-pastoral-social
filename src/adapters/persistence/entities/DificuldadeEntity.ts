import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { FamiliaDificuldadeEntity } from "./FamiliaDificuldadeEntity";

@Entity('TPS_DIFICULDADE')
export class DificuldadeEntity {
  @PrimaryGeneratedColumn({ name: 'id_dificuldade' })
  id: number;

  @Column()
  descricao: string;

  @OneToMany(() => FamiliaDificuldadeEntity, (fd) => fd.dificuldade)
  familias: FamiliaDificuldadeEntity[];

  constructor(
    id: number,
    descricao: string,
    familias: FamiliaDificuldadeEntity[]
  ) {
    this.id = id;
    this.descricao = descricao;
    this.familias = familias;
  }
}