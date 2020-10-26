"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SESMessage = void 0;
const aws_sdk_1 = require("aws-sdk");
const ses_client_1 = require("./ses.client");
const { AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = process.env;
aws_sdk_1.config.update({
    region: AWS_REGION,
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
});
class SESMessage {
    constructor() {
        this.sesClient = new ses_client_1.SESClient();
    }
    sendEmail(content) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sesClient.sendEmail(content);
        });
    }
}
exports.SESMessage = SESMessage;
//# sourceMappingURL=ses.message.js.map