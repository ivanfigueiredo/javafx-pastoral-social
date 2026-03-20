import { Repository } from "typeorm";
import { ItemProdutoEntity } from "./entities/ItemProdutoEntity";
import { Connection } from "./database/Connection";
import { ItemProdutoRepository } from "../../application/port/out/ItemProdutoRepository";

export class ItemProdutoPostgresDatabase implements ItemProdutoRepository {
    private repository: Repository<ItemProdutoEntity>;

    constructor(private readonly connection: Connection) {
        this.repository = connection.getDataSourcer().getRepository(ItemProdutoEntity);
    }

    public async getProdutos(): Promise<ItemProdutoEntity[]> {
        return this.repository.find();
    }
}