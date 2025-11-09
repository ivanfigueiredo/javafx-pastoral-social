import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from "typeorm";
import { FamiliaDificuldadeEntity } from "./FamiliaDificuldadeEntity";
import { DificuldadeTipoAjudaEntity } from "./DificuldadeTipoAjudaEntity";

@Entity('tps_dificuldade', {schema: 'familia'})
export class DificuldadeEntity {
  @PrimaryGeneratedColumn({ name: 'id_dificuldade' })
  id: number;

  @Column({ name: 'descricao', type: 'varchar' })
  descricao: string;

  @OneToOne(() => DificuldadeTipoAjudaEntity, (dificuldadeTipoAjuda) => dificuldadeTipoAjuda.dificuldade)
  dificuldadeTipoAjuda: DificuldadeTipoAjudaEntity | null;

  @OneToMany(() => FamiliaDificuldadeEntity, (fd) => fd.dificuldade)
  familias: FamiliaDificuldadeEntity[] = [];

  constructor(
    id: number,
    descricao: string,
    dificuldadeTipoAjuda: DificuldadeTipoAjudaEntity | null,
    familias: FamiliaDificuldadeEntity[]
  ) {
    this.id = id;
    this.dificuldadeTipoAjuda = dificuldadeTipoAjuda;
    this.descricao = descricao;
    this.familias = familias;
  }
}