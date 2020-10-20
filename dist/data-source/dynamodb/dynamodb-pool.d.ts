import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
export declare class DynamodbPoolSingleton {
    private static _instance;
    private _datasource;
    constructor();
    static getInstance(): DynamodbPoolSingleton;
    getDataSource(): DocumentClient;
}
