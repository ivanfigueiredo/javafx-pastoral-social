import { Repository } from "typeorm";
import { LocalizacaoRepository } from "../../application/port/out/LocalizacaoRepository";
import { Connection } from "./database/Connection";
import { UnitOfWork } from "./unitOfWork/UnitOfWork";
import { LocalizacaoEntity } from "./entities/LocalizacaoEntity";

export class LocalizacaoPostgresDatabase implements LocalizacaoRepository {
    private readonly localizacaoRepository: Repository<LocalizacaoEntity>;

    constructor(
        private readonly connection: Connection,
        private readonly unitOfwork: UnitOfWork
    ) {
        this.localizacaoRepository = connection.getDataSourcer().getRepository(LocalizacaoEntity);
    }

    public async countLocalizacaoDisponivel(estante: number): Promise<number> {
        return this.localizacaoRepository.count({ where: { estante, isDisponivel: true } });
    }

    public async findLocalizacao(estante: number, limit: number): Promise<LocalizacaoEntity[]> {
        return this.localizacaoRepository.find({
            where: { estante, isDisponivel: true },
            take: limit
        });
    }
}