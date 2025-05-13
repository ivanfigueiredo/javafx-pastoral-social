import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { CestaGeradaEntity } from "./CestaGeradaEntity";

@Entity('TPS_STATUS_CESTA')
export class StatusCestaEntity {
  @PrimaryGeneratedColumn({ name: 'id_status_cesta' })
  id: number;

  @Column({ name: 'status_cesta', unique: true })
  statusDesc: string;

  @OneToMany(() => CestaGeradaEntity, cestaGerada => cestaGerada.status)
  cestasGeradas: CestaGeradaEntity[];

  constructor(
    id: number,
    statusDesc: string,
    cestasGeradas: CestaGeradaEntity[]
  ) {
    this.id = id;
    this.statusDesc = statusDesc;
    this.cestasGeradas = cestasGeradas;
  }
}