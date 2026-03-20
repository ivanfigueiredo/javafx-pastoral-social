import { Repository } from "typeorm";
import { Connection } from "./database/Connection";
import { TempDataEntity } from "./entities/TempDataEntity";
import { TempDataRepository } from "../../application/port/out/TempDataRepository";

export class TempDataPostgresDatabase implements TempDataRepository {
    private readonly repostiroy: Repository<TempDataEntity>;

    constructor(private readonly connection: Connection) {
        this.repostiroy = connection.getDataSourcer().getRepository(TempDataEntity);
    }

    async save(data: TempDataEntity): Promise<void> {
        await this.repostiroy.save(data);
    }
}