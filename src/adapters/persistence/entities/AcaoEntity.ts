import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TemplateEntity } from "./TemplateEntity";
import { DoacaoRecebidaEntity } from "./DoacaoRecebidaEntity";

@Entity('tps_acao', {schema: 'doador'})
export class AcaoEntity {
    @PrimaryGeneratedColumn({ name: 'acao_id', type: "int4" })
    acaoId: number | null;

    @Column({ name: 'titulo', type: 'varchar', nullable: false })
    titulo: string | null;

    @Column({ name: 'descricao', type: 'varchar', nullable: false })
    descricao: string | null;

    @Column({ name: 'data_evento', type: 'date', nullable: false })
    dataEvento: Date | null;

    @Column({ name: 'tipo_acao', type: 'varchar', nullable: false})
    tipoAcao: string | null;

    @Column({ name: 'data_cadastro', type: 'timestamp', default: () => 'NOW()' })
    dataCadastro: Date | null;

    @Column({ name: 'qtd_acao_social', type: 'int4', nullable: true})
    qtdAcaoSocial: number | null;

    @OneToOne(() => TemplateEntity, (template) => template.acao)
    @JoinColumn({ name: "id_template" })
    templateAcao: TemplateEntity | null;

    @OneToMany(() => DoacaoRecebidaEntity, (doacaoRecebida) => doacaoRecebida.acao)
    doacoesRecebidas: DoacaoRecebidaEntity[] = [];

    constructor(
        acaoId: number | null,
        titulo: string | null,
        descricao: string | null,
        dataEvento: Date | null,
        dataCadastro: Date | null,
        tipoAcao: string | null,
        qtdAcaoSocial: number | null,
        templateAcao: TemplateEntity | null,
        doacoesRecebidas: DoacaoRecebidaEntity[]
    ) {
        this.acaoId = acaoId;
        this.titulo = titulo;
        this.descricao = descricao;
        this.dataEvento = dataEvento;
        this.dataCadastro = dataCadastro;
        this.templateAcao = templateAcao;
        this.tipoAcao = tipoAcao;
        this.qtdAcaoSocial = qtdAcaoSocial;
        this.doacoesRecebidas = doacoesRecebidas;
    }
}