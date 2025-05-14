import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { AjudaRecebidaEntity } from "./AjudaRecebidaEntity";

@Entity('tps_tipo_ajuda')
export class TipoAjudaEntity {
  @PrimaryGeneratedColumn({ name: 'id_tipo_ajuda' })
  id: number;

  @Column({ name: 'tipo_descricao', type: "varchar", unique: true })
  descricao: string;

  @OneToMany(() => AjudaRecebidaEntity, ajuda => ajuda.tipoAjuda)
  ajudas: AjudaRecebidaEntity[];

  constructor(
    id: number,
    descricao: string,
    ajudas: AjudaRecebidaEntity[]
  ) {
    this.id = id;
    this.descricao = descricao;
    this.ajudas = ajudas;
  }
}