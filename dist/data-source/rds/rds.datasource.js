"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RDSDataSource = void 0;
/* eslint-disable @typescript-eslint/no-empty-interface */
const aws_sdk_1 = require("aws-sdk");
const { AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = process.env;
aws_sdk_1.config.update({
    region: AWS_REGION,
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
});
class RDSDataSource {
    mapToModelCollection(models) {
        return models.map((model) => this.modelToMap(model));
    }
    modelToMapCollection(models) {
        return models.map((model) => this.mapToModel(model));
    }
}
exports.RDSDataSource = RDSDataSource;
//# sourceMappingURL=rds.datasource.js.map