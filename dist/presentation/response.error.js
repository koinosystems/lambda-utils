export class ResponseError extends Error {
    constructor(message, code) {
        super();
        this.message = message;
        this.name = `${code}`;
    }
}
