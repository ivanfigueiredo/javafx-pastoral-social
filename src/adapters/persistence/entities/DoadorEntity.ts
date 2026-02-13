import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DoacaoRecebidaEntity } from "./DoacaoRecebidaEntity";

@Entity('tps_doador', {schema: 'doador'})
export class DoadorEntity {
    @PrimaryGeneratedColumn({ name: 'id_estoque', type: "int4" })
    id: number | null;

    @Column({ name: 'doador_nome', type: 'varchar' })
    doadorNome: string;

    @Column({ name: 'doador_telefone', type: 'varchar' })
    doadorTelefone: string;

    @OneToMany(() => DoacaoRecebidaEntity, (dbFornecidas) => dbFornecidas.doador)
    doacoesFornecidas: DoacaoRecebidaEntity[] = [];

    constructor(
        id: number | null,
        doadorNome: string,
        doadorTelefone: string,
        doacoesFornecidas: DoacaoRecebidaEntity[]
    ) {
        this.id = id;
        this.doadorNome = doadorNome;
        this.doadorTelefone = doadorTelefone;
        this.doacoesFornecidas = doacoesFornecidas;
    }
}