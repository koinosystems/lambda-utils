export interface IUser {
    email: string;
    token: string;
    refreshToken: string;
    [key: string]: any;
}
export interface IUserService {
    create(email: string, password: string): Promise<void>;
    login(email: string, password: string): Promise<IUser | null>;
    logout(email: string): Promise<void>;
    changePassword(email: string, oldPassword: string, oldPasswordConfirmation: string, newPassword: string): Promise<void>;
    forgotPassword(email: string): Promise<void>;
    confirmPassword(email: string, verificationCode: string, oldPassword: string, oldPasswordConfirmation: string, newPassword: string): Promise<void>;
    delete(email: string): Promise<void>;
    confirmDelete(email: string, verificationCode?: string): Promise<void>;
}
