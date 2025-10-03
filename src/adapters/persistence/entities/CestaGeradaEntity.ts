import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, OneToMany } from "typeorm";
import { FamiliaEntity } from "./FamiliaEntity";
import { TemplateEntity } from "./TemplateEntity";
import { StatusCestaEntity } from "./StatusCestaEntity";
import { AjudaRecebidaEntity } from "./AjudaRecebidaEntity";

@Entity('tps_cesta_gerada')
export class CestaGeradaEntity {
  @PrimaryGeneratedColumn({ name: 'id_cesta' })
  id: number | null;

  @ManyToOne(() => TemplateEntity)
  @JoinColumn({ name: 'id_template' })
  template: TemplateEntity;

  @ManyToOne(() => FamiliaEntity, { nullable: true })
  @JoinColumn({ name: 'id_familia' })
  familia: FamiliaEntity | null;

  @OneToMany(() => AjudaRecebidaEntity, ajuda => ajuda.cestaGerada)
  ajudas: AjudaRecebidaEntity[];

  @Column({ name: 'data_criacao', type: 'timestamptz' })
  dataCriacao: Date;

  @ManyToOne(() => StatusCestaEntity)
  @JoinColumn({ name: 'id_status' })
  status: StatusCestaEntity;

  constructor(
    id: number | null,
    dataCriacao: Date,
    familia: FamiliaEntity | null,
    template: TemplateEntity,
    status: StatusCestaEntity,
    ajudas: AjudaRecebidaEntity[]
  ) {
    this.id = id;
    this.dataCriacao = dataCriacao;
    this.status = status;
    this.familia = familia;
    this.template = template;
    this.ajudas = ajudas;
  }
}