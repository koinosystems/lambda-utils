import { AWSError } from 'aws-sdk';
import SNS from 'aws-sdk/clients/sns';

export class SNSClient {
  private sns = new SNS({ apiVersion: '2010-03-31' });

  async createTopic(name: string): Promise<SNS.Types.CreateTopicResponse> {
    return new Promise((resolve, reject) => {
      this.sns.createTopic(
        {
          Name: name,
        },
        (err: AWSError, data: SNS.Types.CreateTopicResponse) => {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        }
      );
    });
  }

  async deleteTopic(topicArn: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sns.deleteTopic(
        {
          TopicArn: topicArn,
        },
        (err: AWSError) => {
          if (err) {
            return reject(err);
          }
          return resolve();
        }
      );
    });
  }

  async publish(topicArn: string, message: string): Promise<SNS.Types.PublishResponse> {
    return new Promise((resolve, reject) => {
      this.sns.publish(
        {
          TopicArn: '',
          Message: '',
        },
        (err: AWSError, data: SNS.Types.PublishResponse) => {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        }
      );
    });
  }
}
