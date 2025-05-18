import { RevokedTokenResponseDTO } from "../../dto/RevokedTokenResponseDTO";
import { SecurityDTO } from "../../dto/SecurityDTO";


export interface SecurityRepository {
    save: (dto: SecurityDTO) => Promise<void>;
    findTokenByUserId: (userId: number) => Promise<RevokedTokenResponseDTO>;
    updateMany: (dto: RevokedTokenResponseDTO) => Promise<void>;
    
}