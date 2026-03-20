import { StatusMensagemMetaEnum } from "./enum/StatusMensagemMetaEnum";
import { TypeMessageNotificationEnum } from "./enum/TypeMessageNotificationEnum";

export class WebHookMetaPayloadDTO {
    constructor(readonly entry: WebHookMetaEntryDTO[], readonly object?: string) {}
}

export class WebHookMetaEntryDTO {
    constructor(readonly changes: WebHookMetaChangeDTO[], readonly id?: string) {}
}

export class WebHookMetaChangeDTO {
    constructor(
        readonly value: WebHookMetaValueEntryDTO,
        readonly field: string
    ) {}
}

export class WebHookMetaValueEntryDTO {
    constructor(
        readonly messaging_product: 'whatsapp',
        readonly metadata?: WebHookMetaDataDTO,
        readonly contacts?: WebHookContactDTO[],
        readonly messages?: WebHookMetaMessageDTO[],
        readonly statuses?: WebHookMetaStatusDTO[]
    ) {}
}

export class WebHookContactDTO {
    constructor(
        readonly wa_id: string,
        readonly profile?: {
            name: string
        }
    ) {}
}

export class WebHookMetaDataDTO {
    constructor(readonly display_phone_number: string, readonly phone_number_id: string) {}
}

export class WebHookMetaMessageDTO {
    constructor(
        readonly from: string,
        readonly type: TypeMessageNotificationEnum,
        readonly id: string,
        readonly timestamp: string,
        readonly text?: WebHookMetaTextDTO,
        readonly button?: WebHookMetaButtonDTO,
        readonly interactive?: WebHookMetaInteractiveDTO
    ) {}
}

export class WebHookMetaTextDTO {
    constructor(readonly body: string) {}
}

export class WebHookMetaButtonDTO {
    constructor(
        readonly text: string,
        readonly payload: string
    ) {}
}

export type InteractiveTypeEnum = 'button_reply';

export class WebHookMetaInteractiveDTO {
    constructor(
        readonly type: InteractiveTypeEnum,
        readonly button_reply?: WebHookMetaButtonReplyDTO
    ) {}
}

export class WebHookMetaButtonReplyDTO {
    constructor(
        readonly id: string,
        readonly title: string
    ) {}
}

export class WebHookMetaStatusDTO {
    constructor(
        readonly id: string,
        readonly status: StatusMensagemMetaEnum,
        readonly timestamp: string,
        readonly recipient_id?: string,
        readonly conversation?: ConversationMetaDTO,
        readonly pricing?: PricingMetaDTO
    ) {}
}

export class ConversationMetaDTO {
    constructor(
        readonly id: string,
        readonly origin?: {
            type: string
        }
    ) {}
}

export class PricingMetaDTO {
    constructor(
        readonly billable: boolean,
        readonly pricing_model: string,
        readonly category: string
    ) {}
}