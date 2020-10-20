import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
export class DynamodbPool {
    constructor() {
        this._datasource = new DocumentClient();
        if (DynamodbPool._instance) {
            throw new Error('Error: Instantiation failed: Use DynamodbPool.getInstance() instead of new.');
        }
        DynamodbPool._instance = this;
    }
    static getInstance() {
        return DynamodbPool._instance;
    }
    getDataSource() {
        return this._datasource;
    }
}
DynamodbPool._instance = new DynamodbPool();
