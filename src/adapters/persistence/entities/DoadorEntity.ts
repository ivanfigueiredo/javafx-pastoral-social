import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DoacaoRecebidaEntity } from "./DoacaoRecebidaEntity";

@Index('idx_tps_doador_telefone', ['doadorTelefone'], { unique: true })
@Entity('tps_doador', {schema: 'doador'})
export class DoadorEntity {
    @PrimaryGeneratedColumn({ name: 'id_doador', type: "int4" })
    id: number | null;

    @Column({ name: 'doador_nome', type: 'varchar' })
    doadorNome: string | null;

    @Column({ name: 'doador_telefone', type: 'varchar' })
    doadorTelefone: string | null;

    @OneToMany(() => DoacaoRecebidaEntity, (dbFornecidas) => dbFornecidas.doador)
    doacoesFornecidas: DoacaoRecebidaEntity[] = [];

    constructor(
        id: number | null,
        doadorNome: string | null,
        doadorTelefone: string | null,
        doacoesFornecidas: DoacaoRecebidaEntity[]
    ) {
        this.id = id;
        this.doadorNome = doadorNome;
        this.doadorTelefone = doadorTelefone;
        this.doacoesFornecidas = doacoesFornecidas;
    }
}