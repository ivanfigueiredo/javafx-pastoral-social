import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { FamiliaDificuldadeEntity } from "./FamiliaDificuldadeEntity";
import { FamiliaEntity } from "./FamiliaEntity";

@Entity('TPS_COMUNIDADE')
export class ComunidadeEntity {
    @PrimaryGeneratedColumn({ name: 'id_comunidade' })
    id: number;

    @Column({ name: 'comunidade_desc' })
    descricao: string;

    @OneToMany(() => FamiliaDificuldadeEntity, (fd) => fd.dificuldade)
    familias: FamiliaDificuldadeEntity[];

    @OneToMany(() => FamiliaEntity, (fe) => fe.comunidade)
    familiasComunidade: FamiliaDificuldadeEntity[];

    constructor(
        id: number,
        descricao: string,
        familias: FamiliaDificuldadeEntity[],
        familiasComunidade: FamiliaDificuldadeEntity[]
    ) {
        this.id = id;
        this.descricao = descricao;
        this.familias = familias;
        this.familiasComunidade = familiasComunidade;
    }
}