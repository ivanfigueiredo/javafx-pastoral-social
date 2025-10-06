import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { FamiliaDificuldadeEntity } from "./FamiliaDificuldadeEntity";
import { FamiliaEntity } from "./FamiliaEntity";
import { DoacaoRecebidaEntity } from "./DoacaoRecebidaEntity";

@Entity('tps_comunidade')
export class ComunidadeEntity {
    @PrimaryGeneratedColumn({ name: 'id_comunidade' })
    id: number;

    @Column({ name: 'comunidade_desc', type: 'varchar' })
    descricao: string | null;

    @OneToMany(() => FamiliaDificuldadeEntity, (fd) => fd.dificuldade)
    familias: FamiliaDificuldadeEntity[] = [];

    @OneToMany(() => FamiliaEntity, (fe) => fe.comunidade)
    familiasComunidade: FamiliaDificuldadeEntity[] = [];

    @OneToMany(() => DoacaoRecebidaEntity, (doacoes) => doacoes.comunidade)
    doacoes: DoacaoRecebidaEntity[] = [];

    constructor(
        id: number,
        descricao: string | null = null,
        familias: FamiliaDificuldadeEntity[],
        familiasComunidade: FamiliaDificuldadeEntity[],
        doacoes: DoacaoRecebidaEntity[]
    ) {
        this.id = id;
        this.descricao = descricao;
        this.familias = familias;
        this.familiasComunidade = familiasComunidade;
        this.doacoes = doacoes;
    }
}