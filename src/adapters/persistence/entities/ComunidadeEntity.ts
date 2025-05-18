import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { FamiliaDificuldadeEntity } from "./FamiliaDificuldadeEntity";
import { FamiliaEntity } from "./FamiliaEntity";

@Entity('tps_comunidade')
export class ComunidadeEntity {
    @PrimaryGeneratedColumn({ name: 'id_comunidade' })
    id: number;

    @Column({ name: 'comunidade_desc', type: 'varchar' })
    descricao!: string;

    @OneToMany(() => FamiliaDificuldadeEntity, (fd) => fd.dificuldade)
    familias!: FamiliaDificuldadeEntity[];

    @OneToMany(() => FamiliaEntity, (fe) => fe.comunidade)
    familiasComunidade!: FamiliaDificuldadeEntity[];

    constructor(
        id: number
    ) {
        this.id = id;
    }
}