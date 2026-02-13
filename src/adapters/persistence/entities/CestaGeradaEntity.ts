import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, OneToMany, BeforeInsert, OneToOne } from "typeorm";
import { createHash } from 'crypto';
import { TemplateEntity } from "./TemplateEntity";
import { StatusCestaEntity } from "./StatusCestaEntity";
import { AjudaRecebidaEntity } from "./AjudaRecebidaEntity";
import { CestaEstoqueItemEntity } from "./CestaEstoqueItemEntity";

@Entity('tps_cesta_gerada', {schema: 'ajuda'})
export class CestaGeradaEntity {
  @PrimaryGeneratedColumn({ name: 'id_cesta', type: "int4" })
  id: number | null;

  @ManyToOne(() => TemplateEntity, (template) => template.cestas)
  @JoinColumn({ name: 'id_template' })
  template: TemplateEntity;

  @OneToOne(() => AjudaRecebidaEntity, ajuda => ajuda.cestaGerada)
  ajuda: AjudaRecebidaEntity | null;

  @Column({ name: 'data_criacao', type: 'timestamptz' })
  dataCriacao: Date;

  @Column({ name: 'identificador_cesta', type: 'varchar', nullable: false })
  identificadorCesta?: string;

  @ManyToOne(() => StatusCestaEntity)
  @JoinColumn({ name: 'id_status' })
  status: StatusCestaEntity;

  @OneToMany(() => CestaEstoqueItemEntity, cestaEstoqueItem => cestaEstoqueItem.cesta)
  cestaItens: CestaEstoqueItemEntity[] = [];

  @BeforeInsert()
  private gerarIdentificador(): void {
    this.identificadorCesta = this.geradorIdentificadorCesta();
  }

  constructor(
    id: number | null,
    dataCriacao: Date,
    template: TemplateEntity,
    status: StatusCestaEntity,
    cestaItens: CestaEstoqueItemEntity[],
    ajuda: AjudaRecebidaEntity | null,
    identificadorCesta?: string
  ) {
    this.id = id;
    this.dataCriacao = dataCriacao;
    this.status = status;
    this.template = template;
    this.ajuda = ajuda;
    this.identificadorCesta = identificadorCesta;
    this.cestaItens = cestaItens;
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