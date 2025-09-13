import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { EstoqueEntity } from "./EstoqueEntity";
import { AcaoSocialTemplateEntity } from "./AcaoSocialTemplateEntity";
import { UnidadeMedidaEntity } from "./UnidadeDeMedidaEntity";

@Entity('tps_item_produto')
export class ItemProdutoEntity {
  @PrimaryGeneratedColumn({name: 'id_produto'})
  id: number;

  @Column({ name: 'item_produto_desc', type: 'varchar', unique: true, nullable: false })
  itemProdutoDesc: string;

  @OneToMany(() => EstoqueEntity, estoque => estoque.localizacao)
  estoques: EstoqueEntity[];

  @ManyToOne(() => UnidadeMedidaEntity, unidade => unidade.itemProduto)
  @JoinColumn({ name: 'id_und_medida' })
  unidadeMedida: UnidadeMedidaEntity;

  constructor(
    id: number,
    itemProdutoDesc: string,
    estoques: EstoqueEntity[],
    unidadeMedida: UnidadeMedidaEntity,
    itensCesta: AcaoSocialTemplateEntity[]
  ) {
    this.id = id;
    this.itemProdutoDesc = itemProdutoDesc;
    this.unidadeMedida = unidadeMedida;
    this.estoques = estoques;
  }
}