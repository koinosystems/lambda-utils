import { DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
export declare class DynamodbClient {
    private documentClient;
    constructor(documentClient: DocumentClient);
    scanAll(query: DynamoDB.ScanInput): Promise<any[]>;
    scan(params: DynamoDB.ScanInput): Promise<DynamoDB.ScanOutput>;
    getItem(params: DynamoDB.GetItemInput): Promise<DocumentClient.GetItemOutput>;
    put(params: DynamoDB.PutItemInput): Promise<DocumentClient.GetItemOutput>;
    update(params: DynamoDB.UpdateItemInput): Promise<DocumentClient.UpdateItemOutput>;
    delete(params: DynamoDB.DeleteItemInput): Promise<DocumentClient.DeleteItemOutput>;
    queryAll(params: DynamoDB.QueryInput): Promise<any[]>;
    query(params: DynamoDB.QueryInput): Promise<DocumentClient.QueryOutput>;
}
