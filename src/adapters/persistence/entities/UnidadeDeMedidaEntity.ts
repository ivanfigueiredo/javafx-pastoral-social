import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { EstoqueAlimentoEntity } from "./EstoqueAlimentoEntity";

@Entity('tps_unidade_medida')
export class UnidadeMedidaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'und_medidas', type: 'varchar', unique: true })
  undMedidas!: string;

  @OneToMany(() => EstoqueAlimentoEntity, alimento => alimento.unidadeMedida)
  alimentos!: EstoqueAlimentoEntity[];

  constructor(
    id: number
  ) {
    this.id = id;
  }
}