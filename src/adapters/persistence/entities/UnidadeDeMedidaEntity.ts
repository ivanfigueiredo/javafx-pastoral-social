import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { EstoqueAlimentoEntity } from "./EstoqueAlimentoEntity";

@Entity('TPS_UNIDADE_MEDIDA')
export class UnidadeMedidaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'und_medidas', unique: true })
  undMedidas: string;

  @OneToMany(() => EstoqueAlimentoEntity, alimento => alimento.unidadeMedida)
  alimentos: EstoqueAlimentoEntity[];

  constructor(
    id: number,
    undMedidas: string,
    alimentos: EstoqueAlimentoEntity[]
  ) {
    this.id = id;
    this.undMedidas = undMedidas;
    this.alimentos = alimentos;
  }
}