import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { LocalizacaoEntity } from "./LocalizacaoEntity";
import { ItemProdutoEntity } from "./ItemProdutoEntity";
import { ItemTemplateEntity } from "./ItemTemplateEntity";

@Entity('tps_estoque')
export class EstoqueEntity {
    @PrimaryGeneratedColumn({ name: 'id_estoque' })
    id: number | null;

    @ManyToOne(() => ItemProdutoEntity, itemProduto => itemProduto.estoques)
    @JoinColumn({ name: 'id_item_produto' })
    itemProduto: ItemProdutoEntity;

    @ManyToOne(() => LocalizacaoEntity, localizacao => localizacao.alimentos)
    @JoinColumn({ name: 'id_localizacao' })
    localizacao: LocalizacaoEntity;

    @Column({ type: 'date', nullable: false })
    validade: Date;

    @Column({name: 'is_disponivel', type: 'boolean', nullable: false})
    isDisponivel: boolean | null;

    @OneToMany(() => ItemTemplateEntity, item => item.estoque)
    itensTemplate: ItemTemplateEntity[];

    @Column({ name: 'data_entrada', type: 'date' })
    dataEntrada: Date;

    @Column({ name: 'data_saida', type: 'date', nullable: true })
    dataSaida: Date | null;

  constructor(
    id: number | null,
    dataEntrada: Date,
    validade: Date,
    isDisponivel: boolean | null,
    dataSaida: Date | null,
    localizacao: LocalizacaoEntity,
    itemProduto: ItemProdutoEntity,
    itensTemplate: ItemTemplateEntity[]
  ) {
    this.id = id;
    this.dataEntrada = dataEntrada;
    this.dataSaida = dataSaida;
    this.isDisponivel = isDisponivel;
    this.validade = validade;
    this.localizacao = localizacao;
    this.itemProduto = itemProduto;
    this.itensTemplate = itensTemplate;
  }
}