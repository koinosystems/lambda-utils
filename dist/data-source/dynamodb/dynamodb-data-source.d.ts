import DynamoDB from 'aws-sdk/clients/dynamodb';
import { DynamodbClient } from './dynamodb-client';
export interface IModel {
}
export declare abstract class DynamodbDataSource<T, O = T> {
    documentClient: DynamoDB.DocumentClient;
    dynamodbClient: DynamodbClient;
    constructor();
    abstract modelToMap(model: IModel): O;
    abstract mapToModel(map: T): IModel;
    mapToModelCollection(models: IModel[]): O[];
    modelToMapCollection(models: T[]): IModel[];
    getNonNullAttributeNames(model: any): Object;
    getNonNullExpression(model: any): Object;
    getNonNullUpdate(model: any): Object;
}
