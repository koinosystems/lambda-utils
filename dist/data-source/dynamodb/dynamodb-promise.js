export class DynamodbPromise {
    constructor(documentClient) {
        this.documentClient = documentClient;
    }
    async scan(query) {
        let items = [];
        let result;
        do {
            result = await this.scanPromise(query);
            query.ExclusiveStartKey = undefined;
            items = items.concat(result.Items);
            if (result.LastEvaluatedKey) {
                query.ExclusiveStartKey = result.LastEvaluatedKey;
            }
        } while (result && result.LastEvaluatedKey);
        return items;
    }
    async scanPromise(params) {
        return new Promise((resolve, reject) => {
            this.documentClient.scan(params, (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }
    async getItem(params) {
        return new Promise((resolve, reject) => {
            this.documentClient.get(params, (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }
    async put(params) {
        return new Promise((resolve, reject) => {
            this.documentClient.put(params, (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }
    async update(params) {
        return new Promise((resolve, reject) => {
            this.documentClient.update(params, (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }
    async delete(params) {
        return new Promise((resolve, reject) => {
            this.documentClient.delete(params, (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }
    async query(params) {
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
    }
    async queryPromise(params) {
        const query = params;
        let items = [];
        let result = {
            LastEvaluatedKey: '',
        };
        while (result.LastEvaluatedKey) {
            result = await this.query(query);
            params.ExclusiveStartKey = undefined;
            if (result && result.Items) {
                items = items.concat(result.Items);
            }
            if (result && result.LastEvaluatedKey) {
                params.ExclusiveStartKey = result.LastEvaluatedKey;
            }
        }
        return items;
    }
}
