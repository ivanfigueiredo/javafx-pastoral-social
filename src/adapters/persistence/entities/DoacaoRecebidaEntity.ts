import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ItemProdutoEntity } from "./ItemProdutoEntity";
import { DoadorEntity } from "./DoadorEntity";
import { TipoDoacaoEnum } from "./TipoDoacaoEnum";
import { AcaoEntity } from "./AcaoEntity";

@Entity('tps_doacao_recebida', {schema: 'doador'})
export class DoacaoRecebidaEntity {
    @PrimaryGeneratedColumn({ name: 'id_doacao', type: "int4" })
    id: number | null;

    @ManyToOne(() => ItemProdutoEntity, (itemProduto) => itemProduto.doacoes)
    @JoinColumn({ name: 'id_item_produto' })
    itemProduto: ItemProdutoEntity | null;

    @ManyToOne(() => DoadorEntity, (doador) => doador.doacoesFornecidas)
    @JoinColumn({ name: 'id_doador' })
    doador: DoadorEntity | null;

    @Column({ name: 'quantidade', type: 'int4', nullable: false })
    quantidade: number | null;

    @Column({ name: 'data_doacao', type: 'date' })
    dataDoacao: Date | null;

    @Column({ name: 'tipo_doacao', type: 'enum', enum: TipoDoacaoEnum })
    tipoDoacao: TipoDoacaoEnum;

    @Column({ name: 'observacao', type: 'text', nullable: true })
    observacao: string | null;

    @ManyToOne(() => AcaoEntity, (acao) => acao.doacoesRecebidas)
    @JoinColumn({ name: 'id_acao_social', })
    acao: AcaoEntity | null;

    constructor(
        id: number | null,
        itemProduto: ItemProdutoEntity | null,
        doador: DoadorEntity | null,
        tipoDoacao: TipoDoacaoEnum,
        dataDoacao: Date | null,
        observacao: string | null,
        quantidade: number | null,
        acao: AcaoEntity | null
    ) {
        this.id = id;
        this.itemProduto = itemProduto;
        this.doador = doador;
        this.dataDoacao = dataDoacao;
        this.observacao = observacao;
        this.tipoDoacao = tipoDoacao;
        this.quantidade = quantidade;
        this.acao = acao;
    }
}