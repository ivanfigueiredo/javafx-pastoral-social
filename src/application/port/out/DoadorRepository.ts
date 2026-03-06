import { DoadorEntity } from "../../../adapters/persistence/entities/DoadorEntity";

export interface DoadorRepository {
    findDoadorByTelefone: (telefone: string) => Promise<DoadorEntity | null>;
    save: (doador: DoadorEntity) => Promise<DoadorEntity>;
    findDoadoresAll: () => Promise<DoadorEntity[]>;
}