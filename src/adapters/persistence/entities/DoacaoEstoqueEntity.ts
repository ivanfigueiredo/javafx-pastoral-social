import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { DoacaoRecebidaEntity } from "./DoacaoRecebidaEntity";
import { EstoqueEntity } from "./EstoqueEntity";

@Entity('tps_doacao_estoque')
export class DoacaoEstoqueEntity {
    @PrimaryColumn({ name: 'id_doacao' })
    idDoacao: number;

    @Column({ name: 'id_estoque' })
    idEstoque: number;

    @ManyToOne(() => DoacaoRecebidaEntity, (doacaoReceb) => doacaoReceb.doacoesEstoque, {createForeignKeyConstraints: true})
    @JoinColumn({ name: 'id_doacao' })
    doacao: DoacaoRecebidaEntity;

    @ManyToOne(() => EstoqueEntity, (estok) => estok.doacoesEstoque, {createForeignKeyConstraints: true})
    @JoinColumn({ name: 'id_estoque' })
    estoque: EstoqueEntity;

    @Column({ name: 'quantidade_movimentada', type: 'int4', nullable: false })
    quantidadeMovimentada: number;

    @Column({ name: 'data_movimentacao', type: 'timestamp' })
    dataMovimentacao: Date;

    constructor(
        idDoacao: number,
        idEstoque: number,
        doacao: DoacaoRecebidaEntity,
        estoque: EstoqueEntity,
        quantidadeMovimentada: number,
        dataMovimentacao: Date
    ) {
        this.idDoacao = idDoacao;
        this.idEstoque = idEstoque;
        this.doacao = doacao;
        this.estoque = estoque;
        this.quantidadeMovimentada = quantidadeMovimentada;
        this.dataMovimentacao = dataMovimentacao;
    }
}