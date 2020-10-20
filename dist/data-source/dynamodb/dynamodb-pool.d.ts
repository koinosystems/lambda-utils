import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
export declare class DynamodbPool {
    private static _instance;
    private _datasource;
    constructor();
    static getInstance(): DynamodbPool;
    getDataSource(): DocumentClient;
}
