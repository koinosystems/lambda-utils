"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamodbDataSource = void 0;
/* eslint-disable @typescript-eslint/no-empty-interface */
const aws_sdk_1 = require("aws-sdk");
const document_client_1 = require("aws-sdk/lib/dynamodb/document_client");
const dynamodb_client_1 = require("./dynamodb.client");
const { AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = process.env;
aws_sdk_1.config.update({
    region: AWS_REGION,
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
});
class DynamodbDataSource {
    constructor() {
        this.documentClient = new document_client_1.DocumentClient();
        this.dynamodbClient = new dynamodb_client_1.DynamodbClient(this.documentClient);
    }
    mapToModelCollection(models) {
        return models.map((model) => this.modelToMap(model));
    }
    modelToMapCollection(models) {
        return models.map((model) => this.mapToModel(model));
    }
    getNonNullAttributeNames(model) {
        var _a;
        const nonNullAttributes = {};
        for (const key in model) {
            if (model[key]) {
                nonNullAttributes[`:${key}Value`] = (_a = model[key]) !== null && _a !== void 0 ? _a : null;
            }
        }
        return nonNullAttributes;
    }
    getNonNullExpression(model) {
        const nonNullAttributes = {};
        for (const key in model) {
            if (model[key]) {
                nonNullAttributes[`#${key}`] = key;
            }
        }
        return nonNullAttributes;
    }
    getNonNullUpdate(model) {
        const nonNullUpdate = [];
        for (const key in model) {
            if (model[key]) {
                nonNullUpdate.push(`#${key} =:${key}Value`);
            }
        }
        return 'SET ' + nonNullUpdate.join(', ');
    }
}
exports.DynamodbDataSource = DynamodbDataSource;
//# sourceMappingURL=dynamodb.datasource.js.map