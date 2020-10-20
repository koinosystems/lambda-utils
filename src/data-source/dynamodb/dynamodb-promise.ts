/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AWSError, DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';

export class DynamodbPromise {
  constructor(private documentClient: DocumentClient) {}

  async scan(query: DynamoDB.ScanInput): Promise<any> {
    let items: any[] = [];
    let result;
    do {
      result = await this.scanPromise(query);
      query.ExclusiveStartKey = undefined;
      items = items.concat(result.Items);
      if (result.LastEvaluatedKey) {
        query.ExclusiveStartKey = result.LastEvaluatedKey;
      }
    } while (result && result.LastEvaluatedKey);

    return items;
  }

  async scanPromise(params: DynamoDB.ScanInput): Promise<any> {
    return new Promise((resolve, reject) => {
      this.documentClient.scan(params, (err: AWSError, data: DocumentClient.ScanOutput) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  }

  async getItem(params: DynamoDB.GetItemInput): Promise<any> {
    return new Promise((resolve, reject) => {
      this.documentClient.get(params, (err: AWSError, data: DocumentClient.GetItemOutput) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  }

  async put(params: DynamoDB.PutItemInput): Promise<any> {
    return new Promise((resolve, reject) => {
      this.documentClient.put(params, (err: AWSError, data: DocumentClient.GetItemOutput) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  }

  async update(params: DynamoDB.UpdateItemInput): Promise<any> {
    return new Promise((resolve, reject) => {
      this.documentClient.update(params, (err: AWSError, data: DocumentClient.UpdateItemOutput) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  }

  async delete(params: DynamoDB.DeleteItemInput): Promise<any> {
    return new Promise((resolve, reject) => {
      this.documentClient.delete(params, (err: AWSError, data: DocumentClient.DeleteItemOutput) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  }

  async query(params: DynamoDB.QueryInput): Promise<any> {
    return new Promise((resolve, reject) => {
      this.documentClient.query(params, (err: AWSError, data: DocumentClient.QueryOutput) => {
        if (err) {
          if (err.code === 'ResourceNotFoundException') {
            return resolve({});
          }
          return reject(err);
        }
        return resolve(data);
      });
    });
  }

  async queryPromise(params: DynamoDB.QueryInput): Promise<Array<any>> {
    const query = params;
    let items: Array<any> = [];
    let result: any = {
      LastEvaluatedKey: '',
    };
    while (result.LastEvaluatedKey) {
      result = await this.query(query);
      params.ExclusiveStartKey = undefined;
      if (result && result.Items) {
        items = items.concat(result.Items);
      }
      if (result && result.LastEvaluatedKey) {
        params.ExclusiveStartKey = result.LastEvaluatedKey;
      }
    }
    return items;
  }
}
