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

  @Column({ type: 'date', nullable: false })
  validade: Date;

  @OneToMany(() => EstoqueEntity, estoque => estoque.localizacao)
  estoques: EstoqueEntity[];

  @ManyToOne(() => UnidadeMedidaEntity, unidade => unidade.itemProduto)
  @JoinColumn({ name: 'id_und_medida' })
  unidadeMedida: UnidadeMedidaEntity;

  @OneToMany(() => AcaoSocialTemplateEntity, acaoSocial => acaoSocial.itemProduto)
  itensCesta: AcaoSocialTemplateEntity[];

  constructor(
    id: number,
    itemProdutoDesc: string,
    validade: Date,
    estoques: EstoqueEntity[],
    unidadeMedida: UnidadeMedidaEntity,
    itensCesta: AcaoSocialTemplateEntity[]
  ) {
    this.id = id;
    this.itemProdutoDesc = itemProdutoDesc;
    this.validade = validade;
    this.unidadeMedida = unidadeMedida;
    this.estoques = estoques;
    this.itensCesta = itensCesta;
  }
}