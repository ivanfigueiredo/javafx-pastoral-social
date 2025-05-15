import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { EstoqueAlimentoEntity } from "./EstoqueAlimentoEntity";

@Entity('tps_localizacao_estoque')
export class LocalizacaoEntity {
  @PrimaryGeneratedColumn({ name: 'id_localizacao' })
  id: number;

  @Column({ name: 'localizacao_desc', type: 'varchar', unique: true })
  localizacaoDesc!: string;

  @OneToMany(() => EstoqueAlimentoEntity, alimento => alimento.localizacao)
  alimentos!: EstoqueAlimentoEntity[];

  constructor(
    id: number
  ) {
    this.id = id;
  }
}