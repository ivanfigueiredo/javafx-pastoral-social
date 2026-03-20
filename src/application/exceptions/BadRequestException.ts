import { ExceptionBase } from "./ExceptionBase";

export class BadRequestException extends ExceptionBase {
    statusCode: number = 400;

    constructor(message: string) {
        super(message);
        this.name = 'Bad Request';
    }
}