import { 
    ConversationMetaDTO, 
    PricingMetaDTO, 
    WebHookContactDTO, 
    WebHookMetaButtonDTO, 
    WebHookMetaButtonReplyDTO, 
    WebHookMetaChangeDTO, 
    WebHookMetaDataDTO, 
    WebHookMetaEntryDTO, 
    WebHookMetaInteractiveDTO, 
    WebHookMetaMessageDTO, 
    WebHookMetaPayloadDTO, 
    WebHookMetaStatusDTO, 
    WebHookMetaTextDTO, 
    WebHookMetaValueEntryDTO 
} from "../../application/dto/notificacao/webhook/WebHookMetaPayloadDTO";

export class WhatsappMetaMapper {
    private constructor() {}

    public static toWebHookMetaPayloadDTO(data: any): WebHookMetaPayloadDTO {
        const entries = (data?.payload?.entry ?? []).map((entry: any) => {
            const changes = (entry?.changes ?? []).map((change: any) => {
                const value = change?.value ?? {};
                const messages = value?.messages?.map((message: any) => {
                    const text = message?.text
                        ? new WebHookMetaTextDTO(message.text.body)
                        : undefined;
                    const button = message?.button
                        ? new WebHookMetaButtonDTO(message.button.text, message.button.payload)
                        : undefined;
                    const interactive = message?.interactive
                        ? new WebHookMetaInteractiveDTO(
                            message.interactive.type,
                            message.interactive.button_reply
                                ? new WebHookMetaButtonReplyDTO(
                                    message.interactive.button_reply.id,
                                    message.interactive.button_reply.title
                                )
                                : undefined
                        )
                        : undefined;
                    return new WebHookMetaMessageDTO(
                        message.from,
                        message.type,
                        message.id,
                        message.timestamp,
                        text,
                        button,
                        interactive
                    );
                });
                const statuses = value?.statuses?.map((status: any) => {
                    const conversation = status?.conversation
                        ? new ConversationMetaDTO(
                            status.conversation.id,
                            status.conversation.origin
                        )
                        : undefined;
                    const pricing = status?.pricing
                        ? new PricingMetaDTO(
                            status.pricing.billable,
                            status.pricing.pricing_model,
                            status.pricing.category
                        )
                        : undefined;
                    return new WebHookMetaStatusDTO(
                        status.id,
                        status.status,
                        status.timestamp,
                        status.recipient_id,
                        conversation,
                        pricing
                    );
                });
                const metadata = value?.metadata
                    ? new WebHookMetaDataDTO(
                        value.metadata.display_phone_number,
                        value.metadata.phone_number_id
                    )
                    : undefined;
                const contacts = value?.contacts?.map((contact: any) =>
                    new WebHookContactDTO(
                        contact.wa_id,
                        contact.profile
                            ? { name: contact.profile.name }
                            : undefined
                    )
                );
                return new WebHookMetaChangeDTO(
                    new WebHookMetaValueEntryDTO(
                        value.messaging_product,
                        metadata,
                        contacts,
                        messages,
                        statuses
                    ),
                    change.field
                );
            });
            return new WebHookMetaEntryDTO(
                changes,
                entry.id
            );
        });
        return new WebHookMetaPayloadDTO(entries, data?.object);
    }
}