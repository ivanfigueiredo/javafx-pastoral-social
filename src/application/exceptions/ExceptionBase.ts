export abstract class ExceptionBase extends Error {
    readonly abstract statusCode: number;
    readonly timestamp: string = new Date().toISOString();

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            timestamp: this.timestamp
        };
    }
}