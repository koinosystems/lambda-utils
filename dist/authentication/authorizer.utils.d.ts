import { IAuthentication, IRole } from './authentication.model';
export declare class AuthorizerUtils {
    authorizeByAllowedRoles(credential: IAuthentication, allowedRoles: IRole[]): Promise<void>;
    authorizeByForbiddenRoles(credential: IAuthentication, forbiddenRoles: IRole[]): Promise<void>;
    authorizeByUserId(credential: IAuthentication, id: string): Promise<void>;
}
