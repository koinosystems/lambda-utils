import { config } from 'aws-sdk';
import { DynamodbPoolSingleton } from './dynamodb-pool';
import { DynamodbClient } from './dynamodb-client';
const { AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = process.env;
config.update({
    region: AWS_REGION,
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
});
export class DynamodbDataSource {
    constructor() {
        this.documentClient = DynamodbPoolSingleton.getInstance().getDataSource();
        this.dynamodbClient = new DynamodbClient(this.documentClient);
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
                nonNullAttributes[`:${key}Value`] = model[key] ?? null;
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
