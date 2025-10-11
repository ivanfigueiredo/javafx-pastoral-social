import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { DoacaoRecebidaEntity } from "./DoacaoRecebidaEntity";
import { EstoqueEntity } from "./EstoqueEntity";

@Entity('tps_doacao_estoque')
export class DoacaoEstoqueEntity {
    @PrimaryGeneratedColumn({ name: 'id_doacao' })
    idDoacao: number;

    @PrimaryColumn({ name: 'id_estoque', type: "int4" })
    idEstoque: number;

    @ManyToOne(() => DoacaoRecebidaEntity, (doacaoReceb) => doacaoReceb.doacoesEstoque)
    @JoinColumn({ name: 'id_doacao' })
    doacao: DoacaoRecebidaEntity;

    @ManyToOne(() => EstoqueEntity, (estok) => estok.doacoesEstoque)
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