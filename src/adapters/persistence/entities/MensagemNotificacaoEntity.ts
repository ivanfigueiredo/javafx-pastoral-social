import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { NotificacaoTypeEnum } from "../../../application/dto/enuns/NotificacaoTypeEnum";

@Entity('tps_mensagem_notificacao', {schema: 'config'})
export class MensagemNotificacaoEntity {
    @PrimaryGeneratedColumn({ name: "id_mensagem", type: "int4" })
    idMensagem: number | null;

    @Column({ name: "notificacao_type", type: "enum", enum: NotificacaoTypeEnum, nullable: false })
    notificacaoType: NotificacaoTypeEnum | null;

    @Column({ name: 'template_name', type: "varchar", nullable: false })
    templateName: string | null;

    @Column({ name: "parametros_msg", type: "varchar", nullable: false })
    parametrosMensagem: string | null;

    constructor(
        idMensagem: number | null,
        notificacaoType: NotificacaoTypeEnum | null,
        templateName: string | null,
        parametrosMensagem: string | null
    ) {
        this.idMensagem = idMensagem;
        this.notificacaoType = notificacaoType;
        this.templateName = templateName;
        this.parametrosMensagem = parametrosMensagem;
    }
}