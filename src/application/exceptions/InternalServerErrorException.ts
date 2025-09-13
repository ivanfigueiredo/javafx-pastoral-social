import { ExceptionBase } from "./ExceptionBase";

export class InternalServerErrorException extends ExceptionBase {
    statusCode: number = 500;
    
    constructor(message: string) {
        super(message);
        this.name = 'Internal Server Error';
    }
}