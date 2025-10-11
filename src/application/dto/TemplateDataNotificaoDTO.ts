export class TemplateDataNotificaoDTO {
    constructor(
        readonly name: string,
        readonly language: {code: string}
    ) {}
}