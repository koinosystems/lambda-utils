import { config } from 'aws-sdk';
const { AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = process.env;
config.update({
    region: AWS_REGION,
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
});
export class RDSDataSource {
    mapToModelCollection(models) {
        return models.map((model) => this.modelToMap(model));
    }
    modelToMapCollection(models) {
        return models.map((model) => this.mapToModel(model));
    }
}
