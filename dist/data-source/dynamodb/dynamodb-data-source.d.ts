import DynamoDB from 'aws-sdk/clients/dynamodb';
import { DynamodbPromise } from './dynamodb-promise';
export interface IModel {
    id: string;
}
export declare abstract class DynamodbDataSource<T, O = T> {
    documentClient: DynamoDB.DocumentClient;
    dynamodbPromise: DynamodbPromise;
    constructor();
    abstract modelToMap(model: IModel): O;
    abstract mapToModel(map: T): IModel;
    mapToModelCollection(models: IModel[]): O[];
    modelToMapCollection(models: T[]): IModel[];
    getNonNullAttributeNames(model: any): Object;
    getNonNullExpression(model: any): Object;
    getNonNullUpdate(model: any): Object;
}
