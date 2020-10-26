"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseError = void 0;
class ResponseError extends Error {
    constructor(message, code) {
        super();
        this.message = message;
        this.name = `${code}`;
    }
}
exports.ResponseError = ResponseError;
//# sourceMappingURL=response.error.js.map