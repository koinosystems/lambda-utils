export declare class CognitoAuthenticationClient {
    private client;
    private userPool;
    refreshSession(username: string, refreshToken: string): Promise<any>;
    authenticateUser(username: string, password: string): Promise<any>;
    globalSignOut(username: string): Promise<void>;
    adminConfirmSignUp(username: string): Promise<void>;
    signUp(attribute: string, username: string, password: string): Promise<any>;
    changePassword(username: string, oldPassword: string, newPassword: string): Promise<void>;
    forgotPassword(username: string): Promise<void>;
    confirmPassword(username: string, verificationCode: string, password: string): Promise<void>;
    adminDeleteUser(username: string): Promise<void>;
}
