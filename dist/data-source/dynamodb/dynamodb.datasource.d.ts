import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { DynamodbClient } from './dynamodb.client';
import { IModel } from './dynamodb.model';
export declare abstract class DynamodbDataSource<T, O = T> {
    protected documentClient: DocumentClient;
    protected dynamodbClient: DynamodbClient;
    abstract modelToMap(model: IModel): O;
    abstract mapToModel(map: T): IModel;
    mapToModelCollection(models: IModel[]): O[];
    modelToMapCollection(models: T[]): IModel[];
    getNonNullAttributeNames(model: any): Object;
    getNonNullExpression(model: any): Object;
    getNonNullUpdate(model: any): Object;
}
