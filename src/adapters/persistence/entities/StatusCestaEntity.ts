import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { CestaGeradaEntity } from "./CestaGeradaEntity";

@Entity('tps_status_cesta')
export class StatusCestaEntity {
  @PrimaryGeneratedColumn({ name: 'id_status_cesta' })
  id: number;

  @Column({ name: 'status_cesta', type: 'varchar', unique: true })
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