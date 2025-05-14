import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { CestaTemplateEntity } from "./CestaTemplateEntity";
import { EstoqueAlimentoEntity } from "./EstoqueAlimentoEntity";

@Entity('tps_item_template')
export class ItemTemplateEntity {
  @PrimaryGeneratedColumn({ name: 'id_cesta_item' })
  id: number;

  @ManyToOne(() => CestaTemplateEntity, cesta => cesta.itensTemplate)
  @JoinColumn({ name: 'id_cesta_template' })
  cestaTemplate: CestaTemplateEntity;

  @ManyToOne(() => EstoqueAlimentoEntity, alimento => alimento)
  @JoinColumn({ name: 'id_alimento' })
  alimento: EstoqueAlimentoEntity;

  constructor(
    id: number,
    cestaTemplate: CestaTemplateEntity,
    alimento: EstoqueAlimentoEntity
  ) {
    this.id = id;
    this.cestaTemplate = cestaTemplate;
    this.alimento = alimento;
  }
}