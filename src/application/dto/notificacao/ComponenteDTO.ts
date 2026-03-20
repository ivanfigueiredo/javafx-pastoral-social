import { ComponenteTypeEnum } from "./ComponenteTypeEnum";

export class ComponenteDTO {
    constructor(readonly type: ComponenteTypeEnum, readonly parameters: ParameterDTO[]) {}
}

export class ParameterDTO {
    constructor(readonly type: string, public text: string) {}
}