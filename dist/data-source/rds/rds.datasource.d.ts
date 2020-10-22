import { IEntity } from './rds.model';
export declare abstract class RDSDataSource<T, O = T> {
    abstract modelToMap(model: IEntity): O;
    abstract mapToModel(map: T): IEntity;
    mapToModelCollection(models: IEntity[]): O[];
    modelToMapCollection(models: T[]): IEntity[];
}
