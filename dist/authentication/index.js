"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizerUtils = exports.CognitoAuthenticationClient = exports.IRole = void 0;
var authentication_model_1 = require("./authentication.model");
Object.defineProperty(exports, "IRole", { enumerable: true, get: function () { return authentication_model_1.IRole; } });
var cognito_authentication_client_1 = require("./cognito/cognito-authentication.client");
Object.defineProperty(exports, "CognitoAuthenticationClient", { enumerable: true, get: function () { return cognito_authentication_client_1.CognitoAuthenticationClient; } });
var authorizer_utils_1 = require("./authorizer.utils");
Object.defineProperty(exports, "AuthorizerUtils", { enumerable: true, get: function () { return authorizer_utils_1.AuthorizerUtils; } });
//# sourceMappingURL=index.js.map