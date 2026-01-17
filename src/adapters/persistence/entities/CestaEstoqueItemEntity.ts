import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { EstoqueEntity } from "./EstoqueEntity";
import { CestaGeradaEntity } from "./CestaGeradaEntity";

@Entity('tps_cesta_item', {schema: 'ajuda'})
export class CestaEstoqueItemEntity {
    @PrimaryColumn({ name: 'id_cesta', type: "int4" })
    idCesta: number;

    @PrimaryColumn({ name: 'id_estoque', type: "int4" })
    idEstoque: number;

    @OneToOne(() => EstoqueEntity, (estoque) => estoque.cestaItemEstoque)
    @JoinColumn({ name: "id_estoque" })
    cestaEstoqueItem: EstoqueEntity;

    @ManyToOne(() => CestaGeradaEntity, (cesta) => cesta)
    @JoinColumn({ name: 'id_cesta' })
    cesta: CestaGeradaEntity | null;

    constructor(
        idCesta: number,
        idEstoque: number,
        cestaEstoqueItem: EstoqueEntity,
        cesta: CestaGeradaEntity | null
    ) {
        this.idCesta = idCesta;
        this.idEstoque = idEstoque;
        this.cestaEstoqueItem = cestaEstoqueItem;
        this.cesta = cesta;
    }
}