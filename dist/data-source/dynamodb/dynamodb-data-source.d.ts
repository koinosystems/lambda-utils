import DynamoDB from 'aws-sdk/clients/dynamodb';
import { DynamodbPromise } from './dynamodb-promise';
export interface IModel {
}
export declare abstract class DynamodbDataSource<T, O = T> {
    documentClient: DynamoDB.DocumentClient;
    dynamodbPromise: DynamodbPromise;
    constructor();
    abstract mapFromModel(model: IModel): O;
    abstract mapToModel(model: T): IModel;
    mapToModelCollection(models: IModel[]): O[];
    mapFromModelCollection(models: T[]): IModel[];
    getNonNullAttributeNames(model: any): Object;
    getNonNullExpression(model: any): Object;
    getNonNullUpdate(model: any): Object;
}
