import { IEmailContent } from './ses-email-content.model';
import { SESClient } from './ses.client';
export declare abstract class SESMessage {
    protected sesClient: SESClient;
    sendEmail(content: IEmailContent): Promise<any>;
}
