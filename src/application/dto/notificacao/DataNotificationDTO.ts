import { TemplateDataNotificaoDTO } from "./TemplateDataNotificaoDTO";

export class DataNotificationDTO {
    constructor(
        readonly messaging_product: string,
        readonly to: string,
        readonly type: string,
        readonly template?: TemplateDataNotificaoDTO
    ) {}
}