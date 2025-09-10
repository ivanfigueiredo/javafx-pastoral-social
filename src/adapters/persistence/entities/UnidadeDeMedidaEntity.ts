import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ItemProdutoEntity } from "./ItemProdutoEntity";


@Entity('tps_unidade_medida')
export class UnidadeMedidaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'und_medidas', type: 'varchar', unique: true })
  undMedidas: string;

  @OneToMany(() => ItemProdutoEntity, ItemProdutoEntity => ItemProdutoEntity.unidadeMedida)
  itemProduto: ItemProdutoEntity[];

  constructor(
    id: number,
    undMedidas: string,
    itemProduto: ItemProdutoEntity[]
  ) {
    this.id = id;
    this.undMedidas = undMedidas;
    this.itemProduto = itemProduto;
  }
}