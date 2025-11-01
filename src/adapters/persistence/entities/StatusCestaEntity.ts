import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { CestaGeradaEntity } from "./CestaGeradaEntity";

@Entity('tps_status_cesta', {schema: 'ajuda'})
export class StatusCestaEntity {
  @PrimaryGeneratedColumn({ name: 'id_status_cesta' })
  id: number;

  @Column({ name: 'status_cesta', type: 'varchar', unique: true })
  statusDesc: string | null;

  @OneToMany(() => CestaGeradaEntity, cestaGerada => cestaGerada.status)
  cestasGeradas: CestaGeradaEntity[] = [];

  constructor(
    id: number,
    statusDesc: string | null,
    cestasGeradas: CestaGeradaEntity[]
  ) {
    this.id = id;
    this.statusDesc = statusDesc;
    this.cestasGeradas = cestasGeradas;
  }
}