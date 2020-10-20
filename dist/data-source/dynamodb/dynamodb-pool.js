import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
export class DynamodbPoolSingleton {
    constructor() {
        this._datasource = new DocumentClient();
        if (DynamodbPoolSingleton._instance) {
            throw new Error('Error: Instantiation failed: Use DynamodbPool.getInstance() instead of new.');
        }
        DynamodbPoolSingleton._instance = this;
    }
    static getInstance() {
        return DynamodbPoolSingleton._instance;
    }
    getDataSource() {
        return this._datasource;
    }
}
DynamodbPoolSingleton._instance = new DynamodbPoolSingleton();
