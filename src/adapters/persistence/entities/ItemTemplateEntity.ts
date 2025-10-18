import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { TemplateEntity } from "./TemplateEntity";
import { ItemProdutoEntity } from "./ItemProdutoEntity";

@Entity('tps_item_template')
export class ItemTemplateEntity {
  @PrimaryGeneratedColumn({ name: 'id_item_template' })
  id: number | null;

  @ManyToOne(() => TemplateEntity, template => template.itensTemplate)
  @JoinColumn({ name: 'id_template' })
  template: TemplateEntity;

  @Column({ type: 'int4' })
  quantidade: number;

  @ManyToOne(() => ItemProdutoEntity, itemProduto => itemProduto.estoques)
  @JoinColumn({ name: 'id_item_produto' })
  itemProduto: ItemProdutoEntity;

  constructor(
    id: number | null,
    quantidade: number,
    template: TemplateEntity,
    itemProduto: ItemProdutoEntity
  ) {
    this.id = id;
    this.quantidade = quantidade;
    this.template = template;
    this.itemProduto = itemProduto;
  }
}