import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { EstoqueEntity } from "./EstoqueEntity"
import { UnidadeMedidaEntity } from "./UnidadeDeMedidaEntity";
import { DoacaoRecebidaEntity } from "./DoacaoRecebidaEntity";

@Entity('tps_item_produto')
export class ItemProdutoEntity {
  @PrimaryGeneratedColumn({name: 'id_produto'})
  id: number;

  @Column({ name: 'item_produto_desc', type: 'varchar', unique: true, nullable: false })
  itemProdutoDesc: string | null;

  @OneToMany(() => EstoqueEntity, estoque => estoque.localizacao)
  estoques: EstoqueEntity[] = [];

  @OneToMany(() => DoacaoRecebidaEntity, (dbRecebida) => dbRecebida.itemProduto)
  doacoes: DoacaoRecebidaEntity[] = [];

  @ManyToOne(() => UnidadeMedidaEntity, unidade => unidade.itemProduto, {
    eager: true
  })
  @JoinColumn({ name: 'id_und_medida' })
  unidadeMedida: UnidadeMedidaEntity | null;

  constructor(
    id: number,
    itemProdutoDesc: string | null = null,
    unidadeMedida: UnidadeMedidaEntity | null = null,
    estoques: EstoqueEntity[],
    doacoes: DoacaoRecebidaEntity[]
  ) {
    this.id = id;
    this.itemProdutoDesc = itemProdutoDesc;
    this.unidadeMedida = unidadeMedida;
    this.estoques = estoques;
    this.doacoes = doacoes;
  }
}