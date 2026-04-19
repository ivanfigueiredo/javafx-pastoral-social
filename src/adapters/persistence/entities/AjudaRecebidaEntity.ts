import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, OneToOne, Index, In } from "typeorm";
import { TipoAjudaEntity } from "./TipoAjudaEntity";
import { FamiliaEntity } from "./FamiliaEntity";
import { CestaGeradaEntity } from "./CestaGeradaEntity";
import { StatusAjudaEnum } from "./StatusAjudaEnum";

@Index('idx_tdr_familia_ajuda_recebida', ['familia'])
@Index('idx_tdr_tipo_ajuda_ajuda_recebida', ['tipoAjuda'])
@Index('idx_tdr_cesta_ajuda_recebida', ['cestaGerada'])
@Entity('tps_ajuda_recebida', {schema: 'ajuda'})
export class AjudaRecebidaEntity {
  @PrimaryGeneratedColumn({ name: 'id_ajuda_recebida', type: "int4" })
  id: number | null;

  @ManyToOne(() => FamiliaEntity, familia => familia.ajudasRecebidas, {
    eager: true
  })
  @JoinColumn({ name: 'id_familia' })
  familia: FamiliaEntity;

  @ManyToOne(() => TipoAjudaEntity, tipo => tipo.ajudas, {
    eager: true
  })
  @JoinColumn({ name: 'id_tipo_ajuda' })
  tipoAjuda: TipoAjudaEntity;

  @OneToOne(() => CestaGeradaEntity, cesta => cesta.ajuda, { eager: true, nullable: true, cascade: true })
  @JoinColumn({ name: 'id_cesta' })
  cestaGerada: CestaGeradaEntity | null;

  @Column({ name: 'data_entrega', nullable: true, type: 'date' })
  dataEntrega: string | null;

  @Column({ name: 'data_criacao', type: 'timestamptz' })
  dataCriacao: string | null;

  @Column({ name: 'entrega_aprovada', type: 'bool', default: false })
  entregaAprovada: boolean;

  @Column({ name: 'observacao', nullable: true, type: 'varchar' })
  observacao: string | null;

  @Column({ name: 'status_ajuda', type: 'enum', enum: StatusAjudaEnum })
  statusAjuda: StatusAjudaEnum;

  @Column({ name: 'envolveu_autoridade', type: 'bool', default: false })
  envolveuAutoridade: boolean;

  @Column({ name: 'autoridade_nome', type: 'varchar', nullable: true })
  autoridadeNome: string | null;

  constructor(
    id: number | null,
    dataEntrega: string | null,
    envolveuAutoridade: boolean,
    entregaAprovada: boolean,
    statusAjuda: StatusAjudaEnum,
    autoridadeNome: string | null,
    observacao: string | null,
    dataCriacao: string | null,
    familia: FamiliaEntity,
    tipoAjuda: TipoAjudaEntity,
    cestaGerada: CestaGeradaEntity | null
  ) {
    this.id = id;
    this.dataEntrega = dataEntrega;
    this.envolveuAutoridade = envolveuAutoridade;
    this.entregaAprovada = entregaAprovada;
    this.autoridadeNome = autoridadeNome;
    this.familia = familia;
    this.dataCriacao = dataCriacao;
    this.statusAjuda = statusAjuda;
    this.observacao = observacao;
    this.tipoAjuda = tipoAjuda;
    this.cestaGerada = cestaGerada;
  }
}