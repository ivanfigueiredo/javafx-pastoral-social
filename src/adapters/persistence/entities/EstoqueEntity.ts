import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { LocalizacaoEntity } from "./LocalizacaoEntity";
import { ItemProdutoEntity } from "./ItemProdutoEntity";
import { DoacaoEstoqueEntity } from "./DoacaoEstoqueEntity";
import { CestaEstoqueItemEntity } from "./CestaEstoqueItemEntity";

@Entity('tps_estoque', {schema: 'estoque'})
export class EstoqueEntity {
    @PrimaryGeneratedColumn({ name: 'id_estoque' })
    id: number | null;

    @ManyToOne(() => ItemProdutoEntity, itemProduto => itemProduto.estoques, {
      eager: true
    })
    @JoinColumn({ name: 'id_item_produto' })
    itemProduto: ItemProdutoEntity;

    @ManyToOne(() => LocalizacaoEntity, localizacao => localizacao.estoques, {
      cascade: true
    })
    @JoinColumn({ name: 'id_localizacao' })
    localizacao: LocalizacaoEntity;

    @Column({ type: 'date', nullable: false })
    validade: Date;

    @Column({name: 'is_disponivel', type: 'boolean', nullable: false})
    isDisponivel: boolean | null;

    @OneToMany(() => DoacaoEstoqueEntity, (doacaoEstoque) => doacaoEstoque.estoque)
    doacoesEstoque: DoacaoEstoqueEntity[] = [];

    @Column({ name: 'data_entrada', type: 'date' })
    dataEntrada: Date;

    @Column({ name: 'data_saida', type: 'date', nullable: true })
    dataSaida: Date | null;

    @OneToOne(() => CestaEstoqueItemEntity, (cestaEstoque) => cestaEstoque.cestaEstoqueItem)
    cestaItemEstoque: CestaEstoqueItemEntity | null;


  constructor(
    id: number | null,
    dataEntrada: Date,
    validade: Date,
    isDisponivel: boolean | null = null,
    dataSaida: Date | null = null,
    localizacao: LocalizacaoEntity,
    itemProduto: ItemProdutoEntity,
    cestaItemEstoque: CestaEstoqueItemEntity | null,
    doacoesEstoque: DoacaoEstoqueEntity[]
  ) {
    this.id = id;
    this.dataEntrada = dataEntrada;
    this.dataSaida = dataSaida;
    this.isDisponivel = isDisponivel;
    this.validade = validade;
    this.localizacao = localizacao;
    this.itemProduto = itemProduto;
    this.doacoesEstoque = doacoesEstoque;
    this.cestaItemEstoque = cestaItemEstoque;
  }
}