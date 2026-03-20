import { TempDataEntity } from "../../../adapters/persistence/entities/TempDataEntity";

export interface TempDataRepository {
    save: (data: TempDataEntity) => Promise<void>;
}