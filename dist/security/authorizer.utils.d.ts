import { ICredential, IRole } from './credential';
export declare class AuthorizerUtils {
    authorizeByAllowedRoles(credential: ICredential, allowedRoles: IRole[]): Promise<ICredential>;
    authorizeByForbiddenRoles(credential: ICredential, forbiddenRoles: IRole[]): Promise<ICredential>;
    authorizeByUserId(credential: ICredential, id: string): Promise<ICredential>;
}