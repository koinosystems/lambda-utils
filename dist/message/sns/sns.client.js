import SNS from 'aws-sdk/clients/sns';
export class SNSClient {
    constructor() {
        this.sns = new SNS({ apiVersion: '2010-03-31' });
    }
    async createTopic(name) {
        return new Promise((resolve, reject) => {
            this.sns.createTopic({
                Name: name,
            }, (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }
    async deleteTopic(topicArn) {
        return new Promise((resolve, reject) => {
            this.sns.deleteTopic({
                TopicArn: topicArn,
            }, (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }
    async publish(topicArn, message) {
        return new Promise((resolve, reject) => {
            this.sns.publish({
                TopicArn: '',
                Message: '',
            }, (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }
}
