/* eslint-disable @typescript-eslint/no-empty-interface */
import { config } from 'aws-sdk';
import DynamoDB from 'aws-sdk/clients/dynamodb';

import { DynamodbPool } from './dynamodb-pool';
import { DynamodbPromise } from './dynamodb-promise';

const { AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = process.env;

config.update({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

export interface IModel {}

export abstract class DynamodbDataSource<T, O = T> {
  public documentClient: DynamoDB.DocumentClient;
  public dynamodbPromise: DynamodbPromise;

  constructor() {
    this.documentClient = DynamodbPool.getInstance().getDataSource();
    this.dynamodbPromise = new DynamodbPromise(this.documentClient);
  }

  public abstract mapFromModel(model: IModel): O;

  public abstract mapToModel(model: T): IModel;

  public mapToModelCollection(models: IModel[]): O[] {
    return models.map((model) => this.mapFromModel(model));
  }

  public mapFromModelCollection(models: T[]): IModel[] {
    return models.map((model) => this.mapToModel(model));
  }

  getNonNullAttributeNames(model: any): Object {
    const nonNullAttributes: any = {};
    for (const key in model) {
      if (model[key]) {
        nonNullAttributes[':' + key + 'Value'] = model[key] === '' ? null : model[key];
      }
    }
    return nonNullAttributes;
  }

  getNonNullExpression(model: any): Object {
    const nonNullAttributes: any = {};
    for (const key in model) {
      if (model[key]) {
        nonNullAttributes['#' + key] = key;
      }
    }
    return nonNullAttributes;
  }

  getNonNullUpdate(model: any): Object {
    let nonNullUpdate = 'SET ';
    for (const key in model) {
      if (model[key]) {
        if (nonNullUpdate.length > 5) nonNullUpdate = nonNullUpdate + ', ';
        nonNullUpdate = nonNullUpdate + '#' + key + ' =:' + key + 'Value';
      }
    }
    return nonNullUpdate;
  }
}
