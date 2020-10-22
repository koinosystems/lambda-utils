import { config } from 'aws-sdk';
import { IEmailContent } from './ses-email-content.model';
import { SESClient } from './ses.client';

const { AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = process.env;

config.update({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

export abstract class SESMessage {
  protected sesClient = new SESClient();

  async sendEmail(content: IEmailContent): Promise<any> {
    return this.sesClient.sendEmail(content);
  }
}
