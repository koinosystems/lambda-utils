import SESV2 from 'aws-sdk/clients/sesv2';
import { IEmailContent } from './ses-email-content.model';
export declare class SESClient {
    private ses;
    sendEmail(content: IEmailContent): Promise<SESV2.Types.SendEmailResponse>;
}
