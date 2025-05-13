import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { EstoqueAlimentoEntity } from "./EstoqueAlimentoEntity";
import { CestaTemplateEntity } from "./CestaTemplateEntity";

@Entity('TPS_ITEM_PRODUTO')
export class ItemProdutoEntity {
  @PrimaryGeneratedColumn({name: 'id_item_produto'})
  id: number;

  @Column({ name: 'item_produto_desc', unique: true })
  itemProdutoDesc: string;

  @OneToMany(() => EstoqueAlimentoEntity, alimento => alimento.localizacao)
  alimentos: EstoqueAlimentoEntity[];

  @OneToMany(() => CestaTemplateEntity, cestaTemplate => cestaTemplate.itemProduto)
  itensCesta: CestaTemplateEntity[];

  constructor(
    id: number,
    itemProdutoDesc: string,
    alimentos: EstoqueAlimentoEntity[],
    itensCesta: CestaTemplateEntity[]
  ) {
    this.id = id;
    this.itemProdutoDesc = itemProdutoDesc;
    this.alimentos = alimentos;
    this.itensCesta = itensCesta;
  }
}