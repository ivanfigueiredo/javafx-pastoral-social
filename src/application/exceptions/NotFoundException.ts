import { ExceptionBase } from "./ExceptionBase";

export class NotFoundException extends ExceptionBase {
    statusCode: number = 404;
    
    constructor(message: string) {
        super(message);
        this.name = 'NotFoundException';
    }
}