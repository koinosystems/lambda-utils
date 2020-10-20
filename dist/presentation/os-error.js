"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OSError = void 0;
class OSError extends Error {
    constructor(message, code) {
        super();
        this.message = message;
        this.name = `${code}`;
    }
}
exports.OSError = OSError;
//# sourceMappingURL=os-error.js.map