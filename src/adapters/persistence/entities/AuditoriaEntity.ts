import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./UserEntity";
import { StatusOperacaoEnum } from "./StatusOperacaoEnum";

@Entity('tps_auditoria', {schema: 'auditoria'})
export class AuditoriaEntity {
    @PrimaryGeneratedColumn({ name: 'id_auditoria', type: "int4" })
    id: number | null;

    @Column({ name: 'tabela_nome', type: "varchar", length: 50, nullable: true })
    tabelaNome: string | null;

    @Column({ name: 'registro_id', type: 'int4', nullable: true })
    registroId: number | null;

    @Column({ name: 'acao', type: "varchar", length: 100, nullable: false })
    acao: string;

    @ManyToOne(() => UserEntity, (user) => user.auditorias, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({ name: 'payload', type: "jsonb", nullable: false })
    payload: any;

    @Column({ name: 'resultado', type: "jsonb", nullable: true })
    resultado: any | null;

    @Column({ name: 'status_operacao', type: "varchar", enum: StatusOperacaoEnum, nullable: false })
    statusOperacao: StatusOperacaoEnum;

    @Column({ name: 'data_operacao', type: 'timestamptz', default: () => 'NOW()' })
    dataOperacao: Date | null;

    constructor(
        id: number | null,
        tabelaNome: string | null,
        registroId: number | null,
        acao: string,
        user: UserEntity,
        payload: any,
        resultado: any | null,
        statusOperacao: StatusOperacaoEnum,
        dataOperacao: Date | null
    ) {
        this.id = id;
        this.tabelaNome = tabelaNome;
        this.registroId = registroId;
        this.acao = acao;
        this.user = user;
        this.payload = payload;
        this.resultado = resultado;
        this.statusOperacao = statusOperacao;
        this.dataOperacao = dataOperacao;
    }
}