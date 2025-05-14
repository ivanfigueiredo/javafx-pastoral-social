import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { EstoqueAlimentoEntity } from "./EstoqueAlimentoEntity";

@Entity('TPS_LOCALIZACAO_ESTOQUE')
export class LocalizacaoEntity {
  @PrimaryGeneratedColumn({ name: 'id_localizacao' })
  id: number;

  @Column({ name: 'localizacao_desc', type: 'varchar', unique: true })
  localizacaoDesc: string;

  @OneToMany(() => EstoqueAlimentoEntity, alimento => alimento.localizacao)
  alimentos: EstoqueAlimentoEntity[];

  constructor(
    id: number,
    localizacaoDesc: string,
    alimentos: EstoqueAlimentoEntity[]
  ) {
    this.id = id;
    this.localizacaoDesc = localizacaoDesc;
    this.alimentos = alimentos;
  }
}