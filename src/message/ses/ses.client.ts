import { AWSError } from 'aws-sdk';
import SESV2 from 'aws-sdk/clients/sesv2';
import { IEmailContent } from './ses-email-content.model';

export class SESClient {
  private ses = new SESV2({ apiVersion: '2019-09-27' });

  async sendEmail(content: IEmailContent): Promise<SESV2.Types.SendEmailResponse> {
    return new Promise((resolve, reject) => {
      this.ses.sendEmail(
        {
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
        },
        (err: AWSError, data: SESV2.Types.SendEmailResponse) => {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        }
      );
    });
  }
}
