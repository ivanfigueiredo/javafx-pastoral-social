import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ItemProdutoEntity } from "./ItemProdutoEntity";
import { DoacaoRecebidaEntity } from "./DoacaoRecebidaEntity";


@Entity('tps_unidade_medida')
export class UnidadeMedidaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'und_medidas', type: 'varchar', unique: true })
  undMedidas: string | null;

  @OneToMany(() => ItemProdutoEntity, (itemProdutoEntity) => itemProdutoEntity.unidadeMedida)
  itemProduto: ItemProdutoEntity[] = [];

  @OneToMany(() => DoacaoRecebidaEntity, (itemProdutoEntity) => itemProdutoEntity.undMedida)
  doacoes: DoacaoRecebidaEntity[] = [];

  constructor(
    id: number,
    undMedidas: string | null,
    itemProduto: ItemProdutoEntity[],
    doacoes: DoacaoRecebidaEntity[]
  ) {
    this.id = id;
    this.undMedidas = undMedidas;
    this.itemProduto = itemProduto;
    this.doacoes = doacoes;
  }
}