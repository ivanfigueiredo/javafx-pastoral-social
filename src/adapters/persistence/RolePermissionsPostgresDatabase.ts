import { Repository } from "typeorm";
import { RolePermissionsOutput, RoleRepository } from "../http/authorization/RoleRepository";
import { Connection } from "./database/Connection";
import { RoleEntity } from "./entities/RoleEntity";

export class RolePermissionsPostgresDatabase implements RoleRepository {
    private readonly roleRepository: Repository<RoleEntity>;

    constructor(private readonly connection: Connection) {
        this.roleRepository = this.connection.getDataSourcer().getRepository(RoleEntity);
    }

    public async findPermissions(): Promise<RolePermissionsOutput[]> {
        return this.roleRepository.createQueryBuilder('tr')
            .leftJoin('tr.rolePermissions', 'trp')
            .leftJoin('trp.permission', 'tp')
            .select([
                'tr.description',
                'tp.action'
            ])
            .getRawMany();
    }
}