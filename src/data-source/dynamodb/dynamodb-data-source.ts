/* eslint-disable @typescript-eslint/no-empty-interface */
import { config } from 'aws-sdk';
import DynamoDB from 'aws-sdk/clients/dynamodb';

import { DynamodbPoolSingleton } from './dynamodb-pool';
import { DynamodbClient } from './dynamodb-client';

const { AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = process.env;

config.update({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

export interface IModel {}

export abstract class DynamodbDataSource<T, O = T> {
  public documentClient: DynamoDB.DocumentClient;
  public dynamodbClient: DynamodbClient;

  constructor() {
    this.documentClient = DynamodbPoolSingleton.getInstance().getDataSource();
    this.dynamodbClient = new DynamodbClient(this.documentClient);
  }

  public abstract modelToMap(model: IModel): O;

  public abstract mapToModel(map: T): IModel;

  public mapToModelCollection(models: IModel[]): O[] {
    return models.map((model) => this.modelToMap(model));
  }

  public modelToMapCollection(models: T[]): IModel[] {
    return models.map((model) => this.mapToModel(model));
  }

  getNonNullAttributeNames(model: any): Object {
    const nonNullAttributes: any = {};
    for (const key in model) {
      if (model[key]) {
        nonNullAttributes[`:${key}Value`] = model[key] ?? null;
      }
    }
    return nonNullAttributes;
  }

  getNonNullExpression(model: any): Object {
    const nonNullAttributes: any = {};
    for (const key in model) {
      if (model[key]) {
        nonNullAttributes[`#${key}`] = key;
      }
    }
    return nonNullAttributes;
  }

  getNonNullUpdate(model: any): Object {
    const nonNullUpdate: string[] = [];
    for (const key in model) {
      if (model[key]) {
        nonNullUpdate.push(`#${key} =:${key}Value`);
      }
    }
    return 'SET ' + nonNullUpdate.join(', ');
  }
}
