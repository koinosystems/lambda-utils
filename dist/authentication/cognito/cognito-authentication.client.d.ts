import 'cross-fetch/polyfill';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
export interface CognitoPublicKey {
    alg: string;
    e: string;
    kid: string;
    kty: string;
    n: string;
    use: string;
}
export interface CognitoPublicKeys {
    keys: CognitoPublicKey[];
}
export interface CognitoClaim {
    token_use: string;
    auth_time: number;
    iss: string;
    exp: number;
    username: string;
    client_id: string;
}
export declare class CognitoAuthenticationClient {
    getPublicKeys(): Promise<CognitoPublicKey[]>;
    refreshSession(username: string, refreshToken: string): Promise<CognitoUserSession>;
    authenticateUser(username: string, password: string): Promise<CognitoUserSession>;
    globalSignOut(username: string): Promise<void>;
    adminConfirmSignUp(username: string): Promise<void>;
    signUp(attribute: string, username: string, password: string): Promise<void>;
    changePassword(username: string, oldPassword: string, newPassword: string): Promise<void>;
    forgotPassword(username: string): Promise<void>;
    confirmPassword(username: string, verificationCode: string, password: string): Promise<void>;
    adminDeleteUser(username: string): Promise<void>;
}
