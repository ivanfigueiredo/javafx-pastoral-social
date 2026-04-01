export class AcaoFilterQueryDTO {
    constructor(
        readonly page: number,
        readonly pageSize: number,
        readonly dataInicio?: Date,
        readonly dataFim?: Date,
        readonly statusAcao?: string
    ) {}
}