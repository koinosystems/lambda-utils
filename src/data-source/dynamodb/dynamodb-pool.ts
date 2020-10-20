import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';

export class DynamodbPoolSingleton {
  private static _instance: DynamodbPoolSingleton = new DynamodbPoolSingleton();
  private _datasource: DocumentClient = new DocumentClient();

  constructor() {
    if (DynamodbPoolSingleton._instance) {
      throw new Error(
        'Error: Instantiation failed: Use DynamodbPool.getInstance() instead of new.'
      );
    }
    DynamodbPoolSingleton._instance = this;
  }

  public static getInstance(): DynamodbPoolSingleton {
    return DynamodbPoolSingleton._instance;
  }

  public getDataSource(): DocumentClient {
    return this._datasource;
  }
}
