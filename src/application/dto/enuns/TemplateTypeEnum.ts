export enum TemplateTypeEnum {
    CESTA_BASICA = 'CESTA_BASICA',
    JANTA = 'JANTA',
    ALMOCO = 'ALMOCO'
}

export const TemplateTypeEnumDescricao: Record<TemplateTypeEnum, string> = {
    [TemplateTypeEnum.CESTA_BASICA]: 'Cesta Básica',
    [TemplateTypeEnum.JANTA]: 'Janta',
    [TemplateTypeEnum.ALMOCO]: 'Almoço'
};