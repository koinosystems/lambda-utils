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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SESClient = void 0;
const sesv2_1 = __importDefault(require("aws-sdk/clients/sesv2"));
class SESClient {
    constructor() {
        this.ses = new sesv2_1.default({ apiVersion: '2019-09-27' });
    }
    sendEmail(content) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.ses.sendEmail({
                    FromEmailAddress: content.fromEmail,
                    Destination: {
                        ToAddresses: content.toEmails,
                    },
                    Content: {
                        Simple: {
                            Body: {
                                Html: {
                                    Charset: content.charset,
                                    Data: content.html,
                                },
                                Text: {
                                    Charset: content.charset,
                                    Data: content.text,
                                },
                            },
                            Subject: {
                                Charset: content.charset,
                                Data: content.subject,
                            },
                        },
                    },
                }, (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(data);
                });
            });
        });
    }
}
exports.SESClient = SESClient;
//# sourceMappingURL=ses.client.js.map