"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamodbPool = void 0;
const document_client_1 = require("aws-sdk/lib/dynamodb/document_client");
class DynamodbPool {
    constructor() {
        this._datasource = new document_client_1.DocumentClient();
        if (DynamodbPool._instance) {
            throw new Error('Error: Instantiation failed: Use DynamodbPool.getInstance() instead of new.');
        }
        DynamodbPool._instance = this;
    }
    static getInstance() {
        return DynamodbPool._instance;
    }
    getDataSource() {
        return this._datasource;
    }
}
exports.DynamodbPool = DynamodbPool;
DynamodbPool._instance = new DynamodbPool();
//# sourceMappingURL=dynamodb-pool.js.map