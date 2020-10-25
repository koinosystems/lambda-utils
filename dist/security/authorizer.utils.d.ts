import { ICredential, IRole } from './credential';
export declare class AuthorizerUtils {
    authorizeByAllowedRoles(credential: ICredential, allowedRoles: IRole[]): Promise<void>;
    authorizeByForbiddenRoles(credential: ICredential, forbiddenRoles: IRole[]): Promise<void>;
    authorizeByUserId(credential: ICredential, id: string): Promise<void>;
}
