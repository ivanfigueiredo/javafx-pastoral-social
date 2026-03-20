import { Repository } from "typeorm";
import { UsuarioRepository } from "../../application/port/out/UsuarioRepository";
import { Connection } from "./database/Connection";
import { UserEntity } from "./entities/UserEntity";
import { SecurityMapper } from "../mappers/SecurityMapper";
import { UserResponseDTO } from "../../application/dto/UserResponseDTO";
import { UnauthorizedException } from "../../application/exceptions/UnauthorizedException";
import { NotFoundException } from "../../application/exceptions/NotFoundException";
import { Logger } from "pino";
import { InternalServerErrorException } from "../../application/exceptions/InternalServerErrorException";

export class UsuarioPostgresDatabase implements UsuarioRepository {
    private readonly logger: Logger;
    private readonly userRepository: Repository<UserEntity>;

    constructor(
        logger: Logger,
        private readonly connection: Connection
    ) {
        this.logger = logger.child({service: "UsuarioPostgresDatabase"})
        this.userRepository = connection.getDataSourcer().getRepository(UserEntity);
    }

    public async findUserByNickName(nickName: string): Promise<UserResponseDTO> {
        const user = await this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.role', 'r')
            .leftJoinAndSelect('r.rolePermissions', 'rrp')
            .leftJoinAndSelect('rrp.permission', 'p')
            .where({nickName})
            .getOne();
        if (!user) throw new UnauthorizedException("Usuário ou senha inválidos");
        return SecurityMapper.toUserResponseDTO(user);
    }

    public async findByTelefone(telefone: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({where: {telefone, isCoordenador: true}});
    }

    public async findUsuarioById(idUsuario: number): Promise<UserEntity> {
        const usuario = await this.userRepository.findOne({where: {id: idUsuario}});
        if (!usuario) throw new NotFoundException('Usuario não encontrado.');
        return usuario;
    }

    public async save(usuario: UserEntity): Promise<void> {
        try {
            await this.userRepository.save(usuario);
        } catch (e: any) {
            this.logger.error({err: e.message}, "Erro ao salvar usuario")
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.");
        }
    }

    public async findAllCoordenadores(): Promise<UserEntity[]> {
        return await this.userRepository.find({
            where: {isCoordenador: true}
        });
    }
}