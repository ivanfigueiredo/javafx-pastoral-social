import { Entity, ManyToOne, JoinColumn, Column } from "typeorm";
import { DificuldadeEntity } from "./DificuldadeEntity";
import { FamiliaEntity } from "./FamiliaEntity";

@Entity('TPS_FAMILIA_DIFICULDADE')
export class FamiliaDificuldadeEntity {
  @ManyToOne(() => FamiliaEntity, (f) => f.dificuldades)
  @JoinColumn({ name: 'id_familia' })
  familia: FamiliaEntity;

  @ManyToOne(() => DificuldadeEntity, (d) => d.familias)
  @JoinColumn({ name: 'id_dificuldade' })
  dificuldade: DificuldadeEntity;

  @Column({ name: 'descricao_outros', nullable: true })
  descricaoOutros: string;

  constructor(
    familia: FamiliaEntity,
    dificuldade: DificuldadeEntity,
    descricaoOutros: string
  ) {
    this.familia = familia;
    this.dificuldade = dificuldade;
    this.descricaoOutros = descricaoOutros;
  }
}