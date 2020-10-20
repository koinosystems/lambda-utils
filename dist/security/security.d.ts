export interface IUser {
    email: string;
}
export interface ISecurityService {
    createUser(email: string, password: string): Promise<void>;
    loginUser(email: string, password: string): Promise<IUser | null>;
    logoutUser(email: string): Promise<void>;
    changePassword(email: string, oldPassword: string, newPassword: string, passwordConfirmation: string): Promise<void>;
    forgotPassword(email: string): Promise<void>;
    confirmPassword(email: string, verificationCode: string, newPassword: string, passwordConfirmation: string): Promise<void>;
    deleteUser(email: string): Promise<void>;
}
