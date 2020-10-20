import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'

export class DynamodbPool {
    private static _instance: DynamodbPool = new DynamodbPool();
    private _datasource: DocumentClient = new DocumentClient();

    constructor () {
      if (DynamodbPool._instance) {
        throw new Error('Error: Instantiation failed: Use DynamodbPool.getInstance() instead of new.')
      }
      DynamodbPool._instance = this
    }

    public static getInstance (): DynamodbPool {
      return DynamodbPool._instance
    }

    public getDataSource (): DocumentClient {
      return this._datasource
    }
}
