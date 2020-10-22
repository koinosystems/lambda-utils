/* eslint-disable @typescript-eslint/no-empty-interface */
import { config } from 'aws-sdk';
import { IEntity } from './rds.model';

const { AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = process.env;

config.update({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

export abstract class RDSDataSource<T, O = T> {
  public abstract modelToMap(model: IEntity): O;

  public abstract mapToModel(map: T): IEntity;

  public mapToModelCollection(models: IEntity[]): O[] {
    return models.map((model) => this.modelToMap(model));
  }

  public modelToMapCollection(models: T[]): IEntity[] {
    return models.map((model) => this.mapToModel(model));
  }
}
