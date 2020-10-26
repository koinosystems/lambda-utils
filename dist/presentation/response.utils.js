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
exports.responseError = exports.responseSuccess = exports.formatResponseDownload = exports.formatReponse = void 0;
function formatReponse(statusCode, body, isBase64Encoded, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, identity-provider, token, Identity-Provider, Token',
            'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
        };
        return Promise.resolve(JSON.parse(JSON.stringify({
            statusCode: statusCode,
            body: JSON.stringify(body),
            isBase64Encoded: isBase64Encoded || false,
            headers: corsHeaders,
        })));
    });
}
exports.formatReponse = formatReponse;
function formatResponseDownload(statusCode, body, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, identity-provider, token, Identity-Provider, Token',
            'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
            'Content-disposition': `attachment; filename=${fileName}`,
            'Content-Type': 'application/zip, application/octet-stream',
            'Accept-Encoding': 'application/zip, application/octet-stream',
        };
        return Promise.resolve(JSON.parse(JSON.stringify({
            statusCode: statusCode,
            body: body,
            isBase64Encoded: false,
            headers: corsHeaders,
        })));
    });
}
exports.formatResponseDownload = formatResponseDownload;
function responseSuccess(statusCode = 200, data = {}, headers = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, identity-provider, token, Identity-Provider, Token',
            'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
        };
        const response = {
            statusCode,
            headers: Object.assign(Object.assign({ 'Content-Type': 'application/json' }, corsHeaders), headers),
            body: JSON.stringify({
                data,
            }),
        };
        return Promise.resolve(response);
    });
}
exports.responseSuccess = responseSuccess;
function responseError(statusCode = 500, err, headers = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(err);
        const response = {
            statusCode,
            headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
            body: JSON.stringify({
                error: err,
            }),
        };
        if (statusCode === 500) {
            response.body = JSON.stringify({
                error: {
                    message: 'There was an internal server error. Please try again later. If the problem persists, please contact technical support.',
                },
            });
        }
        return Promise.resolve(response);
    });
}
exports.responseError = responseError;
//# sourceMappingURL=response.utils.js.map