import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { AcaoSocialTemplateEntity } from "./AcaoSocialTemplateEntity";
import { TemplateTypeEnum } from "./TemplateTypeEnum";

@Entity('tps_template')
export class TemplateEntity {
  @PrimaryGeneratedColumn({ name: 'id_template' })
  id: number;

  @Column({ name: 'template_desc', type: 'varchar' })
  descricao: string;

  @Column({ name: 'template_type', type: 'varchar', enum: TemplateTypeEnum })
  templateType: TemplateTypeEnum;

  @OneToMany(() => AcaoSocialTemplateEntity, acaoSocial => acaoSocial.template)
  cestas: AcaoSocialTemplateEntity[];

  constructor(
    id: number,
    descricao: string,
    templateType: TemplateTypeEnum,
    cestas: AcaoSocialTemplateEntity[]
  ) {
    this.id = id;
    this.descricao = descricao;
    this.templateType = templateType;
    this.cestas = cestas;
  }
}