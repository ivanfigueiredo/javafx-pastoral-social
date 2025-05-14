import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { TemplateEntity } from "./TemplateEntity";
import { ItemTemplateEntity } from "./ItemTemplateEntity";
import { ItemProdutoEntity } from "./ItemProdutoEntity";

@Entity('TPS_CESTA_TEMPLATE')
export class CestaTemplateEntity {
    @PrimaryGeneratedColumn({ name: 'id_cesta_template' })
    id: number;

    @ManyToOne(() => ItemProdutoEntity, itemProduto => itemProduto.itensCesta)
    @JoinColumn({ name: 'id_item_produto' })
    itemProduto: ItemProdutoEntity;

    @ManyToOne(() => TemplateEntity, template => template.cestas)
    @JoinColumn({ name: 'id_template' })
    template: TemplateEntity;

    @Column({ type: 'int4' })
    quantidade: number;

    @OneToMany(() => ItemTemplateEntity, item => item.cestaTemplate)
    itensTemplate: ItemTemplateEntity[];

    constructor(
        id: number,
        quantidade: number,
        itemProduto: ItemProdutoEntity,
        template: TemplateEntity,
        itensTemplate: ItemTemplateEntity[]
    ) {
        this.id = id;
        this.quantidade = quantidade;
        this.itemProduto = itemProduto;
        this.template = template;
        this.itensTemplate = itensTemplate;
    }

}
