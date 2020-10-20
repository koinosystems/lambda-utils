"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamodbDataSource = void 0;
const aws_sdk_1 = require("aws-sdk");
const dynamodb_pool_1 = require("./dynamodb-pool");
const dynamodb_promise_1 = require("./dynamodb-promise");
const { AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = process.env;
aws_sdk_1.config.update({
    region: AWS_REGION,
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
});
class DynamodbDataSource {
    constructor() {
        this.documentClient = dynamodb_pool_1.DynamodbPool.getInstance().getDataSource();
        this.dynamodbPromise = new dynamodb_promise_1.DynamodbPromise(this.documentClient);
    }
    mapToModelCollection(models) {
        return models.map((model) => this.mapFromModel(model));
    }
    mapFromModelCollection(models) {
        return models.map((model) => this.mapToModel(model));
    }
    getNonNullAttributeNames(model) {
        const nonNullAttributes = {};
        for (const key in model) {
            if (model[key]) {
                nonNullAttributes[':' + key + 'Value'] = model[key] === '' ? null : model[key];
            }
        }
        return nonNullAttributes;
    }
    getNonNullExpression(model) {
        const nonNullAttributes = {};
        for (const key in model) {
            if (model[key]) {
                nonNullAttributes['#' + key] = key;
            }
        }
        return nonNullAttributes;
    }
    getNonNullUpdate(model) {
        let nonNullUpdate = 'SET ';
        for (const key in model) {
            if (model[key]) {
                if (nonNullUpdate.length > 5)
                    nonNullUpdate = nonNullUpdate + ', ';
                nonNullUpdate = nonNullUpdate + '#' + key + ' =:' + key + 'Value';
            }
        }
        return nonNullUpdate;
    }
}
exports.DynamodbDataSource = DynamodbDataSource;
//# sourceMappingURL=dynamodb-data-source.js.map