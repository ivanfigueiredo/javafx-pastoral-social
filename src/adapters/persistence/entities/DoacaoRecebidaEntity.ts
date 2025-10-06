import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ItemProdutoEntity } from "./ItemProdutoEntity";
import { DoadorEntity } from "./DoadorEntity";
import { UnidadeMedidaEntity } from "./UnidadeDeMedidaEntity";
import { ComunidadeEntity } from "./ComunidadeEntity";
import { TipoDoacaoEnum } from "./TipoDoacaoEnum";
import { DoacaoEstoqueEntity } from "./DoacaoEstoqueEntity";

@Entity('tps_doacao_recebida')
export class DoacaoRecebidaEntity {
    @PrimaryGeneratedColumn({name: 'id_doacao'})
    id: number | null;

    @ManyToOne(() => ItemProdutoEntity, (itemProduto) => itemProduto.doacoes)
    @JoinColumn({ name: 'id_item_produto' })
    itemProduto: ItemProdutoEntity | null;

    @ManyToOne(() => DoadorEntity, (doador) => doador.doacoesFornecidas)
    @JoinColumn({ name: 'id_doador' })
    doador: DoadorEntity | null;

    @Column({ name: 'quantidade', type: 'int4', nullable: false })
    quantidade: number;

    @ManyToOne(() => UnidadeMedidaEntity, (undMedida) => undMedida.doacoes)
    @JoinColumn({ name: 'id_und_medida', })
    undMedida: UnidadeMedidaEntity | null;

    @Column({ name: 'data_doacao', type: 'date' })
    dataDoacao: Date | null;

    @Column({ name: 'tipo_doacao', type: 'enum', enum: TipoDoacaoEnum })
    tipoDoacao: TipoDoacaoEnum;

    @Column({ name: 'observacao', type: 'text', nullable: true })
    observacao: string | null;

    @ManyToOne(() => ComunidadeEntity, (comunidade) => comunidade.doacoes, {
        eager: true
    })
    @JoinColumn({ name: 'id_comunidade', })
    comunidade: ComunidadeEntity | null;

    @OneToMany(() => DoacaoEstoqueEntity, (doacaoEstoque) => doacaoEstoque)
    doacoesEstoque: DoacaoEstoqueEntity[] = [];

    constructor(
        id: number | null,
        itemProduto: ItemProdutoEntity | null,
        doador: DoadorEntity | null,
        quantidade: number,
        tipoDoacao: TipoDoacaoEnum,
        undMedida: UnidadeMedidaEntity | null,
        dataDoacao: Date | null,
        observacao: string | null,
        comunidade: ComunidadeEntity | null,
        doacoesEstoque: DoacaoEstoqueEntity[]
    ) {
        this.id = id;
        this.itemProduto = itemProduto;
        this.doador = doador;
        this.quantidade = quantidade;
        this.undMedida = undMedida;
        this.dataDoacao = dataDoacao;
        this.observacao = observacao;
        this.comunidade = comunidade;
        this.tipoDoacao = tipoDoacao;
        this.doacoesEstoque = doacoesEstoque;
    }
}