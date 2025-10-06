import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { AcaoSocialTemplateEntity } from "./AcaoSocialTemplateEntity";
import { EstoqueEntity } from "./EstoqueEntity";

@Entity('tps_item_template')
export class ItemTemplateEntity {
  @PrimaryGeneratedColumn({ name: 'id_item_template' })
  id: number | null;

  @ManyToOne(() => AcaoSocialTemplateEntity, acaoSocial => acaoSocial.itensTemplate, {
    eager: true
  })
  @JoinColumn({ name: 'id_acao_social_template' })
  acaoSocialTemplate: AcaoSocialTemplateEntity;

  @ManyToOne(() => EstoqueEntity, estoque => estoque.itensTemplate, {
    eager: true
  })
  @JoinColumn({ name: 'id_estoque' })
  estoque: EstoqueEntity;

  constructor(
    id: number | null,
    acaoSocialTemplate: AcaoSocialTemplateEntity,
    estoque: EstoqueEntity
  ) {
    this.id = id;
    this.acaoSocialTemplate = acaoSocialTemplate;
    this.estoque = estoque;
  }
}