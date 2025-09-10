import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { AcaoSocialTemplateEntity } from "./AcaoSocialTemplateEntity";
import { EstoqueEntity } from "./EstoqueEntity";

@Entity('tps_item_template')
export class ItemTemplateEntity {
  @PrimaryGeneratedColumn({ name: 'id_cesta_item' })
  id: number;

  @ManyToOne(() => AcaoSocialTemplateEntity, acaoSocial => acaoSocial.itensTemplate)
  @JoinColumn({ name: 'id_acao_social_template' })
  acaoSocialTemplate: AcaoSocialTemplateEntity;

  @ManyToOne(() => EstoqueEntity, estoque => estoque.itensTemplate)
  @JoinColumn({ name: 'id_estoque' })
  estoque: EstoqueEntity;

  constructor(
    id: number,
    acaoSocialTemplate: AcaoSocialTemplateEntity,
    estoque: EstoqueEntity
  ) {
    this.id = id;
    this.acaoSocialTemplate = acaoSocialTemplate;
    this.estoque = estoque;
  }
}