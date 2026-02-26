import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { FamiliaDificuldadeEntity } from "./FamiliaDificuldadeEntity";
import { FamiliaEntity } from "./FamiliaEntity";

@Entity('tps_comunidade', {schema: 'familia'})
export class ComunidadeEntity {
    @PrimaryGeneratedColumn({ name: 'id_comunidade', type: "int4" })
    id: number;

    @Column({ name: 'comunidade_desc', type: 'varchar' })
    descricao: string | null;

    @OneToMany(() => FamiliaDificuldadeEntity, (fd) => fd.dificuldade)
    familias: FamiliaDificuldadeEntity[] = [];

    @OneToMany(() => FamiliaEntity, (fe) => fe.comunidade)
    familiasComunidade: FamiliaDificuldadeEntity[] = [];

    constructor(
        id: number,
        descricao: string | null = null,
        familias: FamiliaDificuldadeEntity[],
        familiasComunidade: FamiliaDificuldadeEntity[]
    ) {
        this.id = id;
        this.descricao = descricao;
        this.familias = familias;
        this.familiasComunidade = familiasComunidade;
    }
}