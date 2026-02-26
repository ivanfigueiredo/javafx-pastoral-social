import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ItemProdutoEntity } from "./ItemProdutoEntity";


@Entity('tps_unidade_medida', {schema: 'estoque'})
export class UnidadeMedidaEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: "int4" })
  id: number;

  @Column({ name: 'und_medidas', type: 'varchar', unique: true })
  undMedidas: string | null;

  @OneToMany(() => ItemProdutoEntity, (itemProdutoEntity) => itemProdutoEntity.unidadeMedida)
  itemProduto: ItemProdutoEntity[] = [];

  constructor(
    id: number,
    undMedidas: string | null,
    itemProduto: ItemProdutoEntity[]
  ) {
    this.id = id;
    this.undMedidas = undMedidas;
    this.itemProduto = itemProduto;
  }
}