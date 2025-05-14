import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { EstoqueAlimentoEntity } from "./EstoqueAlimentoEntity";
import { CestaTemplateEntity } from "./CestaTemplateEntity";

@Entity('tps_item_produto')
export class ItemProdutoEntity {
  @PrimaryGeneratedColumn({name: 'id_produto'})
  id: number;

  @Column({ name: 'item_produto_desc', type: 'varchar', unique: true })
  itemProdutoDesc!: string;

  @OneToMany(() => EstoqueAlimentoEntity, alimento => alimento.localizacao)
  alimentos!: EstoqueAlimentoEntity[];

  @OneToMany(() => CestaTemplateEntity, cestaTemplate => cestaTemplate.itemProduto)
  itensCesta!: CestaTemplateEntity[];

  constructor(
    id: number
  ) {
    this.id = id;
  }
}