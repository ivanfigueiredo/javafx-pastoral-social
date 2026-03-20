import { Logger } from "pino";
import { compare, hash } from 'bcrypt';
import { UpdateUsuarioDTO } from "../dto/UpdateUsuarioDTO";
import { UpdateUsuarioUseCase } from "../port/in/UpdateUsuarioUseCase";
import { UsuarioRepository } from "../port/out/UsuarioRepository";
import { InternalServerErrorException } from "../exceptions/InternalServerErrorException";
import { NotFoundException } from "../exceptions/NotFoundException";

export class UpdateUsuarioService implements UpdateUsuarioUseCase {
    private readonly logger: Logger;
    
    constructor(
        logger: Logger,
        private readonly usuarioRepository: UsuarioRepository
    ) {
        this.logger = logger.child({ service: 'UpdateUsuarioUseCase' })
    }

    public async execute(dto: UpdateUsuarioDTO, idUsuario: number): Promise<void> {
        try {
            const usuario = await this.usuarioRepository.findUsuarioById(idUsuario);
            const isSenhaIgualAtual = await this.isSenhaAtualDiferente(dto.novaSenha, usuario.password);
            if (usuario.nome === dto.nome && usuario.telefone === dto.telefone && isSenhaIgualAtual) {
                return;
            }
            if (!isSenhaIgualAtual) {
                usuario.password = await this.hashedSenha(dto.novaSenha);
            }
            if (dto.nome != null && dto.nome != usuario.nome) {
                usuario.nome = dto.nome;
            }
            if (dto.telefone != null && dto.telefone != usuario.telefone) {
                usuario.telefone = this.cleanTelefone(dto.telefone);
            }
            await this.usuarioRepository.save(usuario);
        } catch (e: any) {
            this.logger.error({error: e.message}, 'Erro ao atualizar usuario ');
            if (e instanceof NotFoundException) throw e;
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte.");
        }
    }

    private async isSenhaAtualDiferente(senhaInput: string, senhaActual: string): Promise<boolean> {
        return await compare(senhaInput, senhaActual);
    }

    private async hashedSenha(novaSenha: string): Promise<string> {
        const SALT_ROUNDS = 12;
        return await hash(novaSenha, SALT_ROUNDS);
    }

    public cleanTelefone(telefone: string): string {
        return telefone.replace(/\D/g, '');
    }
}