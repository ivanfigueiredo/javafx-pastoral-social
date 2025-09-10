import { ExceptionBase } from "./ExceptionBase";

export class UnauthorizedException extends ExceptionBase {
    statusCode: number = 401;
    
    constructor(message: string) {
        super(message);
        this.name = 'Unauthorized';
    }
}