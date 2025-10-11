import { Repository } from "typeorm";
import { SecurityDTO } from "../../application/dto/SecurityDTO";
import { SecurityRepository } from "../../application/port/out/SecurityRepository";
import { SecurityEntity } from "./entities/SecurityEntity";
import { Connection } from "./database/Connection";
import { SecurityMapper } from "../mappers/SecurityMapper";
import { RevokedTokenResponseDTO, SecurityRevokedTokenDTO } from "../../application/dto/RevokedTokenResponseDTO";
import { UserEntity } from "./entities/UserEntity";

export class SecurityPostgresDatabase implements SecurityRepository {
    private readonly userRepository: Repository<UserEntity>;
    private readonly securityRepository: Repository<SecurityEntity>;

    constructor(private readonly connection: Connection) {
        this.securityRepository = this.connection.getDataSourcer().getRepository(SecurityEntity);
        this.userRepository = this.connection.getDataSourcer().getRepository(UserEntity);
    }

    public async save(dto: SecurityDTO): Promise<void> {
        await this.securityRepository.save(SecurityMapper.toSecurityEntity(dto));
    }

    public async findTokenByUserId(userId: number): Promise<RevokedTokenResponseDTO> {
        const user = await this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.security', 'security', 'security.revoked = :revoked', { revoked: false })
            .where({ id: userId })
            .getOne();
        return new RevokedTokenResponseDTO(
            {userId: user!.id, nickName: user!.nickName, nome: user!.nome, password: user!.password},
             user!.security.map(sec => new SecurityRevokedTokenDTO(sec.id!, sec.tokenHash, sec.revoked, sec.expiresAt)) 
        );
    }

    public async updateMany(dto: RevokedTokenResponseDTO): Promise<void> {
        await this.securityRepository.save(SecurityMapper.toRevokedToken(dto));
    }
}