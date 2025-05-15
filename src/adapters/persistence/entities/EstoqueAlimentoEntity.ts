import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm";
import { UnidadeMedidaEntity } from "./UnidadeDeMedidaEntity";
import { LocalizacaoEntity } from "./LocalizacaoEntity";
import { ItemProdutoEntity } from "./ItemProdutoEntity";

@Entity('tps_estoque_alimentos')
export class EstoqueAlimentoEntity {
    @PrimaryGeneratedColumn({ name: 'id_alimento' })
    id: number | null;

    @ManyToOne(() => ItemProdutoEntity, itemProduto => itemProduto.alimentos)
    @JoinColumn({ name: 'id_item_produto' })
    itemProduto: ItemProdutoEntity;

    @Column({ type: 'date' })
    validade: Date;

    @ManyToOne(() => LocalizacaoEntity, localizacao => localizacao.alimentos)
    @JoinColumn({ name: 'id_localizacao' })
    localizacao: LocalizacaoEntity;

    @ManyToOne(() => UnidadeMedidaEntity, unidade => unidade.alimentos)
    @JoinColumn({ name: 'id_und_medida' })
    unidadeMedida: UnidadeMedidaEntity;

    @Column({ name: 'data_entrada', type: 'date' })
    dataEntrada: Date;

    @Column({ name: 'data_saida', type: 'date', nullable: true })
    dataSaida: Date | null;

  constructor(
    id: number | null,
    validade: Date,
    dataEntrada: Date,
    dataSaida: Date | null,
    unidadeMedida: UnidadeMedidaEntity,
    localizacao: LocalizacaoEntity,
    itemProduto: ItemProdutoEntity
  ) {
    this.id = id;
    this.validade = validade;
    this.dataEntrada = dataEntrada;
    this.dataSaida = dataSaida;
    this.unidadeMedida = unidadeMedida;
    this.localizacao = localizacao;
    this.itemProduto = itemProduto;
  }
}