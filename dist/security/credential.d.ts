export declare enum IRole {
    User = 0,
    Anonymous = 1
}
export interface ICredential {
    role: IRole;
    userId: string;
    token: string;
}
export interface ICredentialService {
    getToken(): Promise<any>;
    setToken(token: string): Promise<void>;
    verifyToken(): Promise<any>;
    refreshToken(refreshToken: string, email: string): Promise<any>;
    getCredential(): Promise<ICredential>;
    getJwk(): any;
}
