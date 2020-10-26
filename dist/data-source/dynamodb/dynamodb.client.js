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
exports.DynamodbClient = void 0;
class DynamodbClient {
    constructor(documentClient) {
        this.documentClient = documentClient;
    }
    scanAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = [];
            let result;
            do {
                result = yield this.scan(query);
                query.ExclusiveStartKey = undefined;
                items = items.concat(result.Items);
                if (result.LastEvaluatedKey) {
                    query.ExclusiveStartKey = result.LastEvaluatedKey;
                }
            } while (result && result.LastEvaluatedKey);
            return items;
        });
    }
    scan(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.documentClient.scan(params, (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(data);
                });
            });
        });
    }
    getItem(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.documentClient.get(params, (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(data);
                });
            });
        });
    }
    put(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.documentClient.put(params, (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(data);
                });
            });
        });
    }
    update(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.documentClient.update(params, (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(data);
                });
            });
        });
    }
    delete(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.documentClient.delete(params, (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(data);
                });
            });
        });
    }
    queryAll(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = params;
            let items = [];
            let result = {
                LastEvaluatedKey: '',
            };
            while (result.LastEvaluatedKey) {
                result = yield this.query(query);
                params.ExclusiveStartKey = undefined;
                if (result && result.Items) {
                    items = items.concat(result.Items);
                }
                if (result && result.LastEvaluatedKey) {
                    params.ExclusiveStartKey = result.LastEvaluatedKey;
                }
            }
            return items;
        });
    }
    query(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.documentClient.query(params, (err, data) => {
                    if (err) {
                        if (err.code === 'ResourceNotFoundException') {
                            return resolve({});
                        }
                        return reject(err);
                    }
                    return resolve(data);
                });
            });
        });
    }
}
exports.DynamodbClient = DynamodbClient;
//# sourceMappingURL=dynamodb.client.js.map