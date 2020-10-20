import { DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
export declare class DynamodbPromise {
    private documentClient;
    constructor(documentClient: DocumentClient);
    scan(query: DynamoDB.ScanInput): Promise<any>;
    scanPromise(params: DynamoDB.ScanInput): Promise<any>;
    getItem(params: DynamoDB.GetItemInput): Promise<any>;
    put(params: DynamoDB.PutItemInput): Promise<any>;
    update(params: DynamoDB.UpdateItemInput): Promise<any>;
    delete(params: DynamoDB.DeleteItemInput): Promise<any>;
    query(params: DynamoDB.QueryInput): Promise<any>;
    queryPromise(params: DynamoDB.QueryInput): Promise<Array<any>>;
}
