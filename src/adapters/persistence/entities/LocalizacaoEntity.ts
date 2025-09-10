import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { EstoqueEntity } from "./EstoqueEntity";

@Entity('tps_localizacao_estoque')
export class LocalizacaoEntity {
  @PrimaryGeneratedColumn({ name: 'id_localizacao' })
  id: number;

  @Column({ name: 'localizacao_desc', type: 'varchar', unique: true })
  localizacaoDesc!: string;

  @OneToMany(() => EstoqueEntity, estoque => estoque.localizacao)
  alimentos!: EstoqueEntity[];

  constructor(
    id: number
  ) {
    this.id = id;
  }
}