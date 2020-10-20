import { ICredential, ICredentialService, IRole } from './credential';
export declare class Authorizer {
    private credentialService;
    constructor(credentialService: ICredentialService);
    authorizeByAllowedRoles(allowedRoles: IRole[]): Promise<ICredential>;
    authorizeByForbiddenRoles(forbiddenRoles: IRole[]): Promise<ICredential>;
    authorizeByUserId(id: string): Promise<ICredential>;
}
