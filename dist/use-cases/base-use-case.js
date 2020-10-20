"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseUseCase = void 0;
class BaseUseCase {
    async execute(params) {
        try {
            return await this.buildUseCase();
        }
        catch (err) {
            console.log('||error||', err);
            throw (err);
        }
    }
}
exports.BaseUseCase = BaseUseCase;
//# sourceMappingURL=base-use-case.js.map