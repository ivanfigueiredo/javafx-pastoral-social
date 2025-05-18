import { DataSource } from "typeorm";
import "reflect-metadata";
import { Connection } from "./Connection";
import { AjudaRecebidaEntity } from "../entities/AjudaRecebidaEntity";
import { CestaGeradaEntity } from "../entities/CestaGeradaEntity";
import { CestaTemplateEntity } from "../entities/CestaTemplateEntity";
import { ComunidadeEntity } from "../entities/ComunidadeEntity";
import { DificuldadeEntity } from "../entities/DificuldadeEntity";
import { EstoqueAlimentoEntity } from "../entities/EstoqueAlimentoEntity";
import { FamiliaDificuldadeEntity } from "../entities/FamiliaDificuldadeEntity";
import { FamiliaEntity } from "../entities/FamiliaEntity";
import { ItemTemplateEntity } from "../entities/ItemTemplateEntity";
import { ItemProdutoEntity } from "../entities/ItemProdutoEntity";
import { LocalizacaoEntity } from "../entities/LocalizacaoEntity";
import { PermissionEntity } from "../entities/PermissionEntity";
import { RoleEntity } from "../entities/RoleEntity";
import { SecurityEntity } from "../entities/SecurityEntity";
import { StatusCestaEntity } from "../entities/StatusCestaEntity";
import { TemplateEntity } from "../entities/TemplateEntity";
import { UnidadeMedidaEntity } from "../entities/UnidadeDeMedidaEntity";
import { UserEntity } from "../entities/UserEntity";
import { TipoAjudaEntity } from "../entities/TipoAjudaEntity";
import { RolePermissionsEntity } from "../entities/RolePermissionsEntity";

export class PostgresDatabase implements Connection {
    private connection: DataSource;

    constructor() {
        this.connection = new DataSource({
            type: 'postgres',
            host: process.env.HOST_DATABASE,
            port: 5432,
            username: process.env.USER_DATABASE,
            password: process.env.PASSWORD_DATABASE,
            database: process.env.POSTGRES_DB,
            synchronize: false,
            entities: [
                AjudaRecebidaEntity,
                RolePermissionsEntity,
                FamiliaEntity,
                TipoAjudaEntity,
                CestaGeradaEntity,
                CestaTemplateEntity,
                ComunidadeEntity,
                DificuldadeEntity,
                EstoqueAlimentoEntity,
                FamiliaDificuldadeEntity,
                ItemTemplateEntity,
                ItemProdutoEntity,
                LocalizacaoEntity,
                PermissionEntity,
                RoleEntity,
                SecurityEntity,
                StatusCestaEntity,
                TemplateEntity,
                UnidadeMedidaEntity,
                UserEntity
            ]
        });
    }

    async init(): Promise<void> {
        await this.connection.initialize()
            .then(() => { })
            .catch((error) => { console.log(`Error -->> ${error}`) })
    }

    public getDataSourcer(): DataSource {
        return this.connection;
    }
}