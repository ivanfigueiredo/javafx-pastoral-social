import { ComponenteDTO } from "./ComponenteDTO";

export class TemplateDataNotificaoDTO {
    constructor(
        readonly name: string,
        readonly language: {code: string},
        readonly components: ComponenteDTO[]
    ) {}
}