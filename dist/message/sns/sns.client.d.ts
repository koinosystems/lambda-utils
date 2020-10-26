import SNS from 'aws-sdk/clients/sns';
export declare class SNSClient {
    private sns;
    createTopic(name: string): Promise<SNS.Types.CreateTopicResponse>;
    deleteTopic(topicArn: string): Promise<void>;
    publish(topicArn: string, message: string): Promise<SNS.Types.PublishResponse>;
}
