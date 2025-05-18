import { SecurityResponseDTO } from "../../../application/dto/SecurityResponseDTO";

export interface AuthQuery {
    authentication: (accessToken: string) => Promise<SecurityResponseDTO | null>;
}