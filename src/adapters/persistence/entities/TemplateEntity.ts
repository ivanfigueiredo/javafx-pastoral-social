import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { TemplateTypeEnum } from "./TemplateTypeEnum";
import { ItemTemplateEntity } from "./ItemTemplateEntity";

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

  constructor(
    id: number | null,
    descricao: string,
    templateType: TemplateTypeEnum,
    itensTemplate: ItemTemplateEntity[]
  ) {
    this.id = id;
    this.descricao = descricao;
    this.templateType = templateType;
    this.itensTemplate = itensTemplate;
  }
}