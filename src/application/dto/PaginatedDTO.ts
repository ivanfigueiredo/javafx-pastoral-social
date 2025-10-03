export class PaginatedDTO {
    constructor(
        readonly paginaAtual: number, 
        readonly totalItens: number, 
        readonly totalPaginas: number,
        readonly result: any
    ) {}
}