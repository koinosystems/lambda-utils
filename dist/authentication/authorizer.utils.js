"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizerUtils = void 0;
/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/no-explicit-any */
const response_error_1 = require("../presentation/response.error");
class AuthorizerUtils {
    authorizeByAllowedRoles(credential, allowedRoles) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const allowedRole of allowedRoles) {
                    if (credential.role === allowedRole) {
                        return;
                    }
                }
                throw new response_error_1.ResponseError('Unauthorized', 401);
            }
            catch (err) {
                throw new response_error_1.ResponseError(err.message, err.code ? err.code : err.name ? parseInt(err.name) : 500);
            }
        });
    }
    authorizeByForbiddenRoles(credential, forbiddenRoles) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const forbiddenRole of forbiddenRoles) {
                    if (credential.role === forbiddenRole) {
                        throw new response_error_1.ResponseError('Unauthorized', 401);
                    }
                }
            }
            catch (err) {
                throw new response_error_1.ResponseError(err.message, err.code ? err.code : err.name ? parseInt(err.name) : 500);
            }
        });
    }
    authorizeByUserId(credential, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id !== credential.userId) {
                throw new response_error_1.ResponseError('Unauthorized', 401);
            }
        });
    }
}
exports.AuthorizerUtils = AuthorizerUtils;
//# sourceMappingURL=authorizer.utils.js.map