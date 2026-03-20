import { TextDTO } from "./TextDTO";

export class DataNotificationTemplateTextDTO {
    constructor(
        readonly messaging_product: string,
        readonly to: string,
        readonly type: string,
        readonly text: TextDTO
    ) {}
}