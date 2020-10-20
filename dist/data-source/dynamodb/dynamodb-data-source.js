import { config } from 'aws-sdk';
import { DynamodbPool } from './dynamodb-pool';
import { DynamodbPromise } from './dynamodb-promise';
const { AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = process.env;
config.update({
    region: AWS_REGION,
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
});
export class DynamodbDataSource {
    constructor() {
        this.documentClient = DynamodbPool.getInstance().getDataSource();
        this.dynamodbPromise = new DynamodbPromise(this.documentClient);
    }
    mapToModelCollection(models) {
        return models.map((model) => this.modelToMap(model));
    }
    modelToMapCollection(models) {
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
