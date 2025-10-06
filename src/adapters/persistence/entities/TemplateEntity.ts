import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { AcaoSocialTemplateEntity } from "./AcaoSocialTemplateEntity";
import { TemplateTypeEnum } from "./TemplateTypeEnum";

@Entity('tps_template')
export class TemplateEntity {
  @PrimaryGeneratedColumn({ name: 'id_template' })
  id: number | null;

  @Column({ name: 'template_desc', type: 'varchar' })
  descricao: string;

  @Column({ name: 'template_type', type: 'enum', enum: TemplateTypeEnum })
  templateType: TemplateTypeEnum;

  @OneToMany(() => AcaoSocialTemplateEntity, acaoSocial => acaoSocial.template)
  acoes: AcaoSocialTemplateEntity[] = [];

  constructor(
    id: number | null,
    descricao: string,
    templateType: TemplateTypeEnum,
    acoes: AcaoSocialTemplateEntity[]
  ) {
    this.id = id;
    this.descricao = descricao;
    this.templateType = templateType;
    this.acoes = acoes;
  }
}