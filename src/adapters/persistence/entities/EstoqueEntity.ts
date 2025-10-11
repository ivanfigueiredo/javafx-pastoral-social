import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { LocalizacaoEntity } from "./LocalizacaoEntity";
import { ItemProdutoEntity } from "./ItemProdutoEntity";
import { ItemTemplateEntity } from "./ItemTemplateEntity";
import { DoacaoEstoqueEntity } from "./DoacaoEstoqueEntity";

@Entity('tps_estoque')
export class EstoqueEntity {
    @PrimaryGeneratedColumn({ name: 'id_estoque' })
    id: number | null;

    @ManyToOne(() => ItemProdutoEntity, itemProduto => itemProduto.estoques, {
      eager: true
    })
    @JoinColumn({ name: 'id_item_produto' })
    itemProduto: ItemProdutoEntity;

    @ManyToOne(() => LocalizacaoEntity, localizacao => localizacao.alimentos, {
      eager: true
    })
    @JoinColumn({ name: 'id_localizacao' })
    localizacao: LocalizacaoEntity;

    @Column({ type: 'date', nullable: false })
    validade: Date;

    @Column({ name: 'valor_medida', type: 'int4', nullable: false })
    valorMedida: number;

    @Column({name: 'is_disponivel', type: 'boolean', nullable: false})
    isDisponivel: boolean | null;

    @OneToMany(() => ItemTemplateEntity, item => item.estoque)
    itensTemplate: ItemTemplateEntity[] = [];

    @OneToMany(() => DoacaoEstoqueEntity, (doacaoEstoque) => doacaoEstoque.estoque)
    doacoesEstoque: DoacaoEstoqueEntity[] = [];

    @Column({ name: 'data_entrada', type: 'date' })
    dataEntrada: Date;

    @Column({ name: 'data_saida', type: 'date', nullable: true })
    dataSaida: Date | null;

  constructor(
    id: number | null,
    dataEntrada: Date,
    validade: Date,
    valorMedida: number,
    isDisponivel: boolean | null = null,
    dataSaida: Date | null = null,
    localizacao: LocalizacaoEntity,
    itemProduto: ItemProdutoEntity,
    itensTemplate: ItemTemplateEntity[],
    doacoesEstoque: DoacaoEstoqueEntity[]
  ) {
    this.id = id;
    this.dataEntrada = dataEntrada;
    this.dataSaida = dataSaida;
    this.isDisponivel = isDisponivel;
    this.validade = validade;
    this.valorMedida = valorMedida;
    this.localizacao = localizacao;
    this.itemProduto = itemProduto;
    this.itensTemplate = itensTemplate;
    this.doacoesEstoque = doacoesEstoque;
  }
}