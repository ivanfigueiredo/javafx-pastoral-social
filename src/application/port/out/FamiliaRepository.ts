import { FamiliaEntity } from "../../../adapters/persistence/entities/FamiliaEntity";
import { AssociarFamiliaComDificuldadeDTO } from "../../dto/AssociarFamiliaComDificuldadeDTO";
import { CadastrarFamiliaDTO } from "../../dto/familias/CadastrarFamiliaDTO";
import { ComunidadeDTO } from "../../dto/ComunidadeDTO";
import { DificuldadeDTO } from "../../dto/DificuldadeDTO";
import { TipoAjudaEnum } from "../../dto/enuns/TipoAjudaEnum";
import { FamiliaCadastradaDTO } from "../../dto/FamiliaCadastradaDTO";
import { FamiliaFilterQueryDTO } from "../../dto/familias/FamiliaFilterQueryDTO";
import { OpcaoListaDTO } from "../../dto/OpcaoListaDTO";
import { CadastrarFamiliaV2DTO } from "../../dto/familias/CadastrarFamiliaV2DTO";

export interface FamiliaRepository {
    save: (dto: CadastrarFamiliaDTO) => Promise<FamiliaCadastradaDTO>;
    saveV2: (dto: CadastrarFamiliaV2DTO) => Promise<FamiliaCadastradaDTO>;
    findFamiliaById: (idFamilia: number) => Promise<FamiliaEntity | null>;
    findFamiliasByIds: (idsFamilia: number[]) => Promise<FamiliaEntity[]>;
    saveFamiliaDificuldade: (dto: AssociarFamiliaComDificuldadeDTO[]) => Promise<void>;
    findComunidades: () => Promise<ComunidadeDTO[]>;
    findFamilias: (filter: FamiliaFilterQueryDTO) => Promise<[FamiliaEntity[], number]>;
    findFamiliaOptionLista: () => Promise<OpcaoListaDTO[]>;
    findDificuldades: () => Promise<DificuldadeDTO[]>;
    getFamiliasPorTipoAjuda: (tipoAjuda: TipoAjudaEnum) => Promise<FamiliaEntity[]>
}