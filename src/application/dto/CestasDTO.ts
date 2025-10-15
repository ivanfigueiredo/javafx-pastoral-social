export class CestasDTO {
    constructor(
        readonly idCesta: number, 
        readonly identificadorCesta: string,
        readonly descricao: string,
        readonly progresso: string,
        readonly status: string,
        readonly itens: ItemsData[]
    ) {}
}

export class ItemsData {
    constructor(
        readonly itemProdutoId: number, 
        readonly nomeProduto: string,
        readonly quantidade: number,
        readonly valor: number,
        readonly unidadeMedida: string
    ) {}
}