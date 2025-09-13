import { ExceptionBase } from "./ExceptionBase";

export class UnprocessableException extends ExceptionBase {
    statusCode: number = 422;
    
    constructor(message: string) {
        super(message);
        this.name = 'Unprocessable';
    }
}