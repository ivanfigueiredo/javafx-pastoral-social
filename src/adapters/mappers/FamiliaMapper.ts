import { CadastrarFamiliaDTO } from "../../application/dto/familias/CadastrarFamiliaDTO";
import { ComunidadeDTO } from "../../application/dto/ComunidadeDTO";
import { DificuldadeDTO } from "../../application/dto/DificuldadeDTO";
import { OpcaoListaDTO } from "../../application/dto/OpcaoListaDTO";
import { ComunidadeEntity } from "../persistence/entities/ComunidadeEntity";
import { DificuldadeEntity } from "../persistence/entities/DificuldadeEntity";
import { FamiliaEntity } from "../persistence/entities/FamiliaEntity";
import { CadastrarFamiliaV2DTO } from "../../application/dto/familias/CadastrarFamiliaV2DTO";

export class FamiliaMapper {
    private constructor() {}

    public static toFamiliaEntity(dto: CadastrarFamiliaDTO): FamiliaEntity {
        return new FamiliaEntity(
            dto.nomeRepresentante,
            dto.idade,
            dto.cpfRg,
            dto.telefone,
            dto.endereco,
            dto.qtdPessoasResidencia,
            dto.qtdPessoasEmpregadas,
            dto.criancasFrequentamEscola,
            dto.membroComProblemaSaude,
            dto.jaRecebeuAjuda,
            dto.desejaParticiparCursos,
            dto.observacao,
            new Date(),
            new ComunidadeEntity(dto.idComunidade, null, null, [], []),
            [],
            [],
            null
        );
    }

    public static toFamiliaEntityV2(dto: CadastrarFamiliaV2DTO): FamiliaEntity {
        return new FamiliaEntity(
            dto.nomeRepresentante,
            null,
            dto.cpfRg,
            dto.telefone,
            dto.endereco,
            dto.qtdPessoasResidencia,
            dto.qtdPessoasEmpregadas,
            dto.criancasFrequentamEscola,
            dto.membroComProblemaSaude,
            dto.jaRecebeuAjuda,
            dto.desejaParticiparCursos,
            dto.observacao,
            new Date(),
            new ComunidadeEntity(dto.idComunidade, null, null, [], []),
            [],
            [],
            dto.dataNascimento ? new Date(dto.dataNascimento + 'T00:00:00') : null
        );
    }

    public static toListComunidadeDTO(iterator: ComunidadeEntity[]): ComunidadeDTO[] {
        return iterator.map(com => new ComunidadeDTO(com.id, `${com.descricao!} - ${com.localizacao!}`));
    }

    public static toListDifilculdadeDTO(iterator: DificuldadeEntity[]): DificuldadeDTO[] {
        return iterator.map(dif => new DificuldadeDTO(dif.id, dif.descricao));
    }

    public static toOpcaoListaDTO(iterator: FamiliaEntity[]): OpcaoListaDTO[] {
        return iterator.map(fam => new OpcaoListaDTO(fam.id.toString(), fam.nomeRepresentante));
    }
}