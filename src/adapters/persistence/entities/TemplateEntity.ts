import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { CestaTemplateEntity } from "./CestaTemplateEntity";

@Entity('TPS_TEMPLATE')
export class TemplateEntity {
  @PrimaryGeneratedColumn({ name: 'id_template' })
  id: number;

  @Column({ name: 'template_desc', type: 'varchar' })
  descricao: string;

  @OneToMany(() => CestaTemplateEntity, cesta => cesta.template)
  cestas: CestaTemplateEntity[];

  constructor(
    id: number,
    descricao: string,
    cestas: CestaTemplateEntity[]
  ) {
    this.id = id;
    this.descricao = descricao;
    this.cestas = cestas;
  }
}