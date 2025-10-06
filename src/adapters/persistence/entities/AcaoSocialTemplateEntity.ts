import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { TemplateEntity } from "./TemplateEntity";
import { ItemTemplateEntity } from "./ItemTemplateEntity";

@Entity('tps_acao_social_template')
export class AcaoSocialTemplateEntity {
    @PrimaryGeneratedColumn({ name: 'id_acao_social_template' })
    id: number | null;

    @ManyToOne(() => TemplateEntity, template => template.acoes, {
        eager: true
    })
    @JoinColumn({ name: 'id_template' })
    template: TemplateEntity;

    @Column({ type: 'int4' })
    quantidade: number;

    @OneToMany(() => ItemTemplateEntity, item => item.acaoSocialTemplate)
    itensTemplate: ItemTemplateEntity[] = [];

    constructor(
        id: number | null,
        quantidade: number,
        template: TemplateEntity,
        itensTemplate: ItemTemplateEntity[]
    ) {
        this.id = id;
        this.quantidade = quantidade;
        this.template = template;
        this.itensTemplate = itensTemplate;
    }

}
