import { ContextoIdempotencyEnum } from "../enuns/ContextoIdempotencyEnum";

export class IdempotencyDTO {
    constructor(readonly hash: string, readonly payloadData: any, readonly contexto: ContextoIdempotencyEnum) {}
}