export enum TipoAcaoEnum {
    CESTA_BASICA = 'CESTA_BASICA',
    JANTA = 'JANTA',
    DOACAO_ROUPA = 'DOACAO_ROUPA'
}

export const TipoAcao: Record<TipoAcaoEnum, string> = {
    CESTA_BASICA: 'Cestas Básicas',
    JANTA: 'Refeições',
    DOACAO_ROUPA: 'Doação Roupas'
}
