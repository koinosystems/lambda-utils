"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SNSMessage = void 0;
const aws_sdk_1 = require("aws-sdk");
const sns_client_1 = require("./sns.client");
const { AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = process.env;
aws_sdk_1.config.update({
    region: AWS_REGION,
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
});
class SNSMessage {
    constructor() {
        this.snsClient = new sns_client_1.SNSClient();
    }
}
exports.SNSMessage = SNSMessage;
//# sourceMappingURL=sns.message.js.map