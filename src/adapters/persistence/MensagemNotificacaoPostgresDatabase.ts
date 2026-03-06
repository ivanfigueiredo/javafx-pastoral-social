import { Repository } from "typeorm";
import { MensagemNotificacaoRepository } from "../../application/port/out/MensagemNotificacaoRepository";
import { MensagemNotificacaoEntity } from "./entities/MensagemNotificacaoEntity";
import { Connection } from "./database/Connection";

export class MensagemNotificacaoPostgresDatabase implements MensagemNotificacaoRepository {
    private readonly repository: Repository<MensagemNotificacaoEntity>;

    constructor(private readonly connection: Connection) {
        this.repository = this.connection.getDataSourcer().getRepository(MensagemNotificacaoEntity);
    }

    public async findMensagemNotificacaoById(idMensagem: number): Promise<MensagemNotificacaoEntity | null> {
        return this.repository.findOne({ where: {idMensagem} });
    }

}