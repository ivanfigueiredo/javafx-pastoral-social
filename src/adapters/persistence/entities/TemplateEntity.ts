import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from "typeorm";
import { TemplateTypeEnum } from "./TemplateTypeEnum";
import { ItemTemplateEntity } from "./ItemTemplateEntity";
import { CestaGeradaEntity } from "./CestaGeradaEntity";
import { AcaoEntity } from "./AcaoEntity";

@Entity('tps_template', {schema: 'ajuda'})
export class TemplateEntity {
  @PrimaryGeneratedColumn({ name: 'id_template', type: "int4" })
  id: number | null;

  @Column({ name: 'template_desc', type: 'varchar' })
  descricao: string | null;

  @Column({ name: 'template_type', type: 'enum', enum: TemplateTypeEnum })
  templateType: TemplateTypeEnum | null;

  @OneToMany(() => ItemTemplateEntity, itemTemplate => itemTemplate.template)
  itensTemplate: ItemTemplateEntity[] = [];

  @OneToMany(() => CestaGeradaEntity, cesta => cesta.template)
  cestas: CestaGeradaEntity[] = [];

  @OneToOne(() => AcaoEntity, (acao) => acao.templateAcao)
  acao: AcaoEntity | null;

  constructor(
    id: number | null,
    descricao: string | null,
    templateType: TemplateTypeEnum | null,
    itensTemplate: ItemTemplateEntity[],
    cestas: CestaGeradaEntity[],
    acao: AcaoEntity | null
  ) {
    this.id = id;
    this.descricao = descricao;
    this.templateType = templateType;
    this.itensTemplate = itensTemplate;
    this.cestas = cestas;
    this.acao = acao;
  }
}