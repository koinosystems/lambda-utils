import { ClaimVerifyRequest, ICredential, ICredentialService, PublicKey } from '../credential.service';
export declare class CognitoCredentialService implements ICredentialService {
    private cognitoPool;
    private cognitoClient;
    private cacheKeys?;
    private verifyPromised;
    constructor();
    getPublicKeys(): Promise<PublicKey[]>;
    verifyToken(request: ClaimVerifyRequest): Promise<void>;
    refreshToken(refreshToken: string, login: string): Promise<ICredential>;
    login(login: string, password: string): Promise<ICredential>;
    logout(login: string): Promise<void>;
    createUser(login: string, password: string): Promise<ICredential>;
    changePassword(login: string, oldPassword: string, oldPasswordConfirmation: string, newPassword: string): Promise<void>;
    forgotPassword(login: string): Promise<void>;
    confirmPassword(login: string, verificationCode: string, oldPassword: string, oldPasswordConfirmation: string, newPassword: string): Promise<void>;
    deleteUser(login: string): Promise<void>;
    confirmDeleteUser(login: string, verificationCode?: string): Promise<void>;
}
