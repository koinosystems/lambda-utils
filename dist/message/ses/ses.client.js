import SESV2 from 'aws-sdk/clients/sesv2';
export class SESClient {
    constructor() {
        this.ses = new SESV2({ apiVersion: '2019-09-27' });
    }
    async sendEmail(content) {
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
    }
}
