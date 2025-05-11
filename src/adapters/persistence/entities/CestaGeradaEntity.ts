import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { FamiliaEntity } from "./FamiliaEntity";
import { TemplateEntity } from "./TemplateEntity";
import { StatusCestaEntity } from "./StatusCestaEntity";

@Entity('TPS_CESTA_GERADA')
export class CestaGeradaEntity {
  @PrimaryGeneratedColumn({ name: 'id_cesta' })
  id: number;

  @ManyToOne(() => TemplateEntity)
  @JoinColumn({ name: 'id_template' })
  template: TemplateEntity;

  @ManyToOne(() => FamiliaEntity, { nullable: true })
  @JoinColumn({ name: 'id_familia' })
  familia: FamiliaEntity | null;

  @Column({ name: 'data_criacao', type: 'timestamptz' })
  dataCriacao: Date;

  @ManyToOne(() => StatusCestaEntity)
  @JoinColumn({ name: 'id_status' })
  status: StatusCestaEntity;

  constructor(
    id: number,
    dataCriacao: Date,
    familia: FamiliaEntity | null,
    template: TemplateEntity,
    status: StatusCestaEntity
  ) {
    this.id = id;
    this.dataCriacao = dataCriacao;
    this.status = status;
    this.familia = familia;
    this.template = template;
  }
}