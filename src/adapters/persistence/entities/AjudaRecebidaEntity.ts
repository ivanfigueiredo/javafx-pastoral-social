import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { TipoAjudaEntity } from "./TipoAjudaEntity";
import { FamiliaEntity } from "./FamiliaEntity";
import { CestaGeradaEntity } from "./CestaGeradaEntity";

@Entity('tps_ajuda_recebida')
export class AjudaRecebidaEntity {
  @PrimaryGeneratedColumn({ name: 'id_ajuda_recebida' })
  id: number;

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

  @ManyToOne(() => CestaGeradaEntity, cesta => cesta.ajudas, {
    eager: true
  })
  @JoinColumn({ name: 'id_cesta_gerada' })
  cestaGerada: CestaGeradaEntity | null;

  @Column({ name: 'data_entrega', nullable: true, type: 'date' })
  dataEntrega: Date | null;

  @Column({ name: 'entrega_aprovada', type: 'bool', default: false })
  entregaAprovada: boolean;

  @Column({ name: 'observacao', nullable: true, type: 'varchar' })
  observacao: string | null;

  @Column({ name: 'envolveu_autoridade', type: 'bool', default: false })
  envolveuAutoridade: boolean;

  @Column({ name: 'autoridade_nome', type: 'varchar', nullable: true })
  autoridadeNome: string | null;

  constructor(
    id: number,
    dataEntrega: Date | null,
    envolveuAutoridade: boolean,
    entregaAprovada: boolean,
    autoridadeNome: string | null,
    observacao: string | null,
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
    this.observacao = observacao;
    this.tipoAjuda = tipoAjuda;
    this.cestaGerada = cestaGerada;
  }
}