import { CadastrarFamiliaDTO } from "../../application/dto/CadastrarFamiliaDTO";
import { ComunidadeDTO } from "../../application/dto/ComunidadeDTO";
import { DificuldadeDTO } from "../../application/dto/DificuldadeDTO";
import { OpcaoListaDTO } from "../../application/dto/OpcaoListaDTO";
import { ComunidadeEntity } from "../persistence/entities/ComunidadeEntity";
import { DificuldadeEntity } from "../persistence/entities/DificuldadeEntity";
import { FamiliaEntity } from "../persistence/entities/FamiliaEntity";

export class FamiliaMapper {
    private FamiliaMapper() {}

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
            new ComunidadeEntity(dto.idComunidade, null, [], []),
            [],
            []
        );
    }

    public static toListComunidadeDTO(iterator: ComunidadeEntity[]): ComunidadeDTO[] {
        return iterator.map(com => new ComunidadeDTO(com.id, com.descricao!));
    }

    public static toListDifilculdadeDTO(iterator: DificuldadeEntity[]): DificuldadeDTO[] {
        return iterator.map(dif => new DificuldadeDTO(dif.id, dif.descricao));
    }

    public static toOpcaoListaDTO(iterator: FamiliaEntity[]): OpcaoListaDTO[] {
        return iterator.map(fam => new OpcaoListaDTO(fam.id, fam.nomeRepresentante));
    }
}