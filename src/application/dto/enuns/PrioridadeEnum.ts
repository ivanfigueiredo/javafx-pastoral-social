export enum PrioridadeEnum {
    ALTA = "ALTA",
    MEDIA = "MEDIA",
    BAIXA = "BAIXA"
}

export const PrioridadePeso: Record<PrioridadeEnum, number> = {
    [PrioridadeEnum.ALTA]: 1,
    [PrioridadeEnum.MEDIA]: 2,
    [PrioridadeEnum.BAIXA]: 3
};