import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, OneToMany, BeforeInsert } from "typeorm";
import { createHash } from 'crypto';
import { TemplateEntity } from "./TemplateEntity";
import { StatusCestaEntity } from "./StatusCestaEntity";
import { AjudaRecebidaEntity } from "./AjudaRecebidaEntity";

@Entity('tps_cesta_gerada')
export class CestaGeradaEntity {
  @PrimaryGeneratedColumn({ name: 'id_cesta' })
  id: number | null;

  @ManyToOne(() => TemplateEntity)
  @JoinColumn({ name: 'id_template' })
  template: TemplateEntity;

  @OneToMany(() => AjudaRecebidaEntity, ajuda => ajuda.cestaGerada)
  ajudas: AjudaRecebidaEntity[] = [];

  @Column({ name: 'data_criacao', type: 'timestamptz' })
  dataCriacao: Date;

  @Column({ name: 'identificador_cesta', type: 'varchar', nullable: false })
  identificadorCesta?: string;

  @ManyToOne(() => StatusCestaEntity)
  @JoinColumn({ name: 'id_status' })
  status: StatusCestaEntity;

  @BeforeInsert()
  private gerarIdentificador(): void {
    this.identificadorCesta = this.geradorIdentificadorCesta();
  }

  constructor(
    id: number | null,
    dataCriacao: Date,
    template: TemplateEntity,
    status: StatusCestaEntity,
    ajudas: AjudaRecebidaEntity[],
    identificadorCesta?: string
  ) {
    this.id = id;
    this.dataCriacao = dataCriacao;
    this.status = status;
    this.template = template;
    this.ajudas = ajudas;
    this.identificadorCesta = identificadorCesta;
  }

  private geradorIdentificadorCesta(): string {
    const dateNow = new Date();
    const data = `${dateNow.getFullYear()}` +
      `${dateNow.getMonth() + 1}`.toString().padStart(2, '0') +
      `${dateNow.getDate()}`.toString().padStart(2, '0');
    const hash = createHash('md5')
      .update(`${Date.now()}${Math.random()}`)
      .digest('hex')
      .substring(0, 4);
    return `CB${data}${hash}`
  }
}