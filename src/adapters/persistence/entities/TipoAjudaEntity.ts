import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from "typeorm";
import { AjudaRecebidaEntity } from "./AjudaRecebidaEntity";
import { DificuldadeTipoAjudaEntity } from "./DificuldadeTipoAjudaEntity";

@Entity('tps_tipo_ajuda', {schema: 'ajuda'})
export class TipoAjudaEntity {
  @PrimaryGeneratedColumn({ name: 'id_tipo_ajuda', type: "int4" })
  id: number;

  @Column({ name: 'tipo_descricao', type: "varchar", unique: true })
  descricao: string | null;

  @OneToOne(() => DificuldadeTipoAjudaEntity, (dificuldadeTipoAjuda) => dificuldadeTipoAjuda.tipoAjuda)
  tipoAjudaDificuldade: DificuldadeTipoAjudaEntity | null;

  @OneToMany(() => AjudaRecebidaEntity, ajuda => ajuda.tipoAjuda)
  ajudas: AjudaRecebidaEntity[] = [];

  constructor(
    id: number,
    descricao: string | null,
    tipoAjudaDificuldade: DificuldadeTipoAjudaEntity | null,
    ajudas: AjudaRecebidaEntity[]
  ) {
    this.id = id;
    this.descricao = descricao;
    this.ajudas = ajudas;
    this.tipoAjudaDificuldade = tipoAjudaDificuldade;
  }
}