import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { EstoqueEntity } from "./EstoqueEntity";

@Entity('tps_doacao_estoque', {schema: 'doador'})
export class DoacaoEstoqueEntity {
    @PrimaryGeneratedColumn({ name: 'id_doacao', type: "int4" })
    idDoacao: number;

    @PrimaryColumn({ name: 'id_estoque', type: "int4" })
    idEstoque: number;

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
        estoque: EstoqueEntity,
        quantidadeMovimentada: number,
        dataMovimentacao: Date
    ) {
        this.idDoacao = idDoacao;
        this.idEstoque = idEstoque;
        this.estoque = estoque;
        this.quantidadeMovimentada = quantidadeMovimentada;
        this.dataMovimentacao = dataMovimentacao;
    }
}