import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, OneToMany } from "typeorm";
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

  @OneToMany(() => AjudaRecebidaEntity, ajuda => ajuda.cestaGerada)
  ajudas: AjudaRecebidaEntity[] = [];

  @Column({ name: 'data_criacao', type: 'timestamptz' })
  dataCriacao: Date;

  @ManyToOne(() => StatusCestaEntity)
  @JoinColumn({ name: 'id_status' })
  status: StatusCestaEntity;

  constructor(
    id: number | null,
    dataCriacao: Date,
    template: TemplateEntity,
    status: StatusCestaEntity,
    ajudas: AjudaRecebidaEntity[]
  ) {
    this.id = id;
    this.dataCriacao = dataCriacao;
    this.status = status;
    this.template = template;
    this.ajudas = ajudas;
  }
}