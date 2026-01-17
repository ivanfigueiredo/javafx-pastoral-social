import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { DificuldadeEntity } from "./DificuldadeEntity";
import { TipoAjudaEntity } from "./TipoAjudaEntity";

@Entity('tps_dificuldade_tipo_ajuda', {schema: 'familia'})
export class DificuldadeTipoAjudaEntity {
    @PrimaryColumn({ name: 'id_dificuldade', type: "int4" })
    idDificuldade: number | null;

    @PrimaryColumn({ name: 'id_tipo_ajuda', type: "int4" })
    idTipoAjuda: number | null;

    @Column({ name: 'peso', type: 'int4'})
    peso: number | null;

    @OneToOne(() => DificuldadeEntity, (dificuldade) => dificuldade.dificuldadeTipoAjuda)
    @JoinColumn({ name: "id_dificuldade" })
    dificuldade: DificuldadeEntity | null;

    @OneToOne(() => TipoAjudaEntity, (tipoAjuda) => tipoAjuda.tipoAjudaDificuldade)
    @JoinColumn({ name: "id_tipo_ajuda" })
    tipoAjuda: TipoAjudaEntity | null;

    constructor(
        idDificuldade: number | null,
        idTipoAjuda: number | null,
        peso: number | null,
        dificuldade: DificuldadeEntity,
        tipoAjuda: TipoAjudaEntity | null
    ) {
        this.idDificuldade = idDificuldade;
        this.idTipoAjuda = idTipoAjuda;
        this.peso = peso;
        this.dificuldade = dificuldade;
        this.tipoAjuda = tipoAjuda;
    }
    
}