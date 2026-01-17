import { DataSource } from "typeorm";
import "reflect-metadata";
import { Connection } from "./Connection";
import { AjudaRecebidaEntity } from "../entities/AjudaRecebidaEntity";
import { CestaGeradaEntity } from "../entities/CestaGeradaEntity";
import { ComunidadeEntity } from "../entities/ComunidadeEntity";
import { DificuldadeEntity } from "../entities/DificuldadeEntity";
import { EstoqueEntity } from "../entities/EstoqueEntity";
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
import { AuditoriaEntity } from "../entities/AuditoriaEntity";
import { DoadorEntity } from '../entities/DoadorEntity';
import { DoacaoRecebidaEntity } from '../entities/DoacaoRecebidaEntity';
import { DoacaoEstoqueEntity } from '../entities/DoacaoEstoqueEntity';
import { CestaEstoqueItemEntity } from "../entities/CestaEstoqueItemEntity";
import { DificuldadeTipoAjudaEntity } from "../entities/DificuldadeTipoAjudaEntity";

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
            ssl: {
                rejectUnauthorized: true
            },
            entities: [
                AjudaRecebidaEntity,
                RolePermissionsEntity,
                RoleEntity,
                FamiliaEntity,
                TipoAjudaEntity,
                CestaGeradaEntity,
                ComunidadeEntity,
                DificuldadeEntity,
                EstoqueEntity,
                FamiliaDificuldadeEntity,
                ItemTemplateEntity,
                ItemProdutoEntity,
                LocalizacaoEntity,
                PermissionEntity,
                SecurityEntity,
                StatusCestaEntity,
                TemplateEntity,
                UnidadeMedidaEntity,
                UserEntity,
                AuditoriaEntity,
                DoadorEntity,
                DoacaoRecebidaEntity,
                DoacaoEstoqueEntity,
                CestaEstoqueItemEntity,
                DificuldadeTipoAjudaEntity
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