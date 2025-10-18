import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { TemplateTypeEnum } from "./TemplateTypeEnum";
import { ItemTemplateEntity } from "./ItemTemplateEntity";
import { CestaGeradaEntity } from "./CestaGeradaEntity";

@Entity('tps_template')
export class TemplateEntity {
  @PrimaryGeneratedColumn({ name: 'id_template' })
  id: number | null;

  @Column({ name: 'template_desc', type: 'varchar' })
  descricao: string;

  @Column({ name: 'template_type', type: 'enum', enum: TemplateTypeEnum })
  templateType: TemplateTypeEnum;

  @OneToMany(() => ItemTemplateEntity, itemTemplate => itemTemplate.template)
  itensTemplate: ItemTemplateEntity[] = [];

  @OneToMany(() => CestaGeradaEntity, cesta => cesta.template)
  cestas: CestaGeradaEntity[] = [];

  constructor(
    id: number | null,
    descricao: string,
    templateType: TemplateTypeEnum,
    itensTemplate: ItemTemplateEntity[],
    cestas: CestaGeradaEntity[]
  ) {
    this.id = id;
    this.descricao = descricao;
    this.templateType = templateType;
    this.itensTemplate = itensTemplate;
    this.cestas = cestas;
  }
}