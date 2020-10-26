export interface ClaimVerifyRequest {
    readonly token: string;
}
export declare enum IRole {
    User = 0,
    Basic = 1,
    Advanced = 2,
    Anonymous = 3
}
export interface ICredential {
    login: string;
    token: string;
    refreshToken: string;
    role?: IRole;
    [key: string]: any;
}
export interface PublicKey {
    alg: string;
    e: string;
    kid: string;
    kty: string;
    n: string;
    use: string;
}
export interface PublicKeys {
    keys: PublicKey[];
}
export interface Claim {
    token_use: string;
    auth_time: number;
    iss: string;
    exp: number;
    username: string;
    client_id: string;
}
export interface ICredentialService {
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
