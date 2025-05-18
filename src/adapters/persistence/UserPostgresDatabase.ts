import { Repository } from "typeorm";
import { UserRepository } from "../../application/port/out/UserRepository";
import { Connection } from "./database/Connection";
import { UserEntity } from "./entities/UserEntity";
import { SecurityMapper } from "../mappers/SecurityMapper";
import { UserResponseDTO } from "../../application/dto/UserResponseDTO";

export class UserPostgresDatabase implements UserRepository {
    private readonly userRepository: Repository<UserEntity>;

    constructor(private readonly connection: Connection) {
        this.userRepository = connection.getDataSourcer().getRepository(UserEntity);
    }

    public async findUserByNickName(nickName: string): Promise<UserResponseDTO> {
        const user = await this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.role', 'r')
            .leftJoinAndSelect('r.rolePermissions', 'rrp')
            .leftJoinAndSelect('rrp.permission', 'p')
            .where({nickName})
            .getOne();
        if (!user) throw Error("Usuário ou senha inválidos");
        return SecurityMapper.toUserResponseDTO(user);
    }
}