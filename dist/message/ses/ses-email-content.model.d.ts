export interface IEmailContent {
    charset: string;
    subject: string;
    fromEmail: string;
    toEmails: string[];
    html: string;
    text: string;
}
