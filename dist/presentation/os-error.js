export class OSError extends Error {
    constructor(message, code) {
        super();
        this.message = message;
        this.name = `${code}`;
    }
}
