"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRequest = exports.parseBody = void 0;
const class_validator_1 = require("class-validator");
async function validateBody(body, inputModel) {
    let parsedBody = {};
    if (!body) {
        throw new Error('Body object is null, check if method is POST');
    }
    try {
        parsedBody = JSON.parse(body);
    }
    catch (err) {
        throw new Error('MalformedJSON');
    }
    for (const key in parsedBody) {
        inputModel[key] = parsedBody[key];
    }
    await class_validator_1.validate(inputModel, { validationError: { target: false } }).then((errors) => {
        if (errors.length > 0) {
            throw new Error(JSON.stringify(errors));
        }
    });
}
async function parseBody(body, model) {
    const object = new model();
    await validateBody(body, object);
    return object;
}
exports.parseBody = parseBody;
class BaseRequest {
    constructor(query, variables, identityProvider, token) {
        this.body = {
            query: query,
            variables: variables,
        };
        this.headers = {
            identityProvider: identityProvider,
            token: token,
        };
    }
}
exports.BaseRequest = BaseRequest;
//# sourceMappingURL=request-utils.js.map