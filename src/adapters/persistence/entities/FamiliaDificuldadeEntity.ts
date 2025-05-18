import { Entity, ManyToOne, JoinColumn, Column, PrimaryColumn } from "typeorm";
import { DificuldadeEntity } from "./DificuldadeEntity";
import { FamiliaEntity } from "./FamiliaEntity";

@Entity('tps_familia_dificuldade')
export class FamiliaDificuldadeEntity {
   @PrimaryColumn({ name: 'id_familia', type: 'int' })
  familiaId: number;

  @PrimaryColumn({ name: 'id_dificuldade', type: 'int' })
  dificuldadeId: number;
  
  @ManyToOne(() => FamiliaEntity, (f) => f.dificuldades)
  @JoinColumn({ name: 'id_familia' })
  familia: FamiliaEntity | null;

  @ManyToOne(() => DificuldadeEntity, (d) => d.familias)
  @JoinColumn({ name: 'id_dificuldade' })
  dificuldade: DificuldadeEntity | null;

  @Column({ name: 'descricao_outros', type: 'varchar', nullable: true })
  descricaoOutros: string | null;

  constructor(
    familiaId: number,
    dificuldadeId: number,
    descricaoOutros: string | null,
    familia: FamiliaEntity | null,
    dificuldade: DificuldadeEntity | null
  ) {
    this.dificuldadeId = dificuldadeId;
    this.familiaId = familiaId;
    this.familia = familia;
    this.dificuldade = dificuldade;
    this.descricaoOutros = descricaoOutros;
  }
}