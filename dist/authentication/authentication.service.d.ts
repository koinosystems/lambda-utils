import { ChangePasswordRequest, ConfirmDeleteUserRequest, ConfirmPasswordRequest, CreateUserRequest, DeleteUserRequest, ForgotPasswordRequest, IAuthentication, LoginRequest, LogoutRequest, RefreshTokenRequest, VerifyTokenRequest } from './authentication.model';
export interface IAuthenticationService {
    verifyToken(request: VerifyTokenRequest): Promise<void>;
    refreshToken(request: RefreshTokenRequest): Promise<IAuthentication>;
    login(request: LoginRequest): Promise<IAuthentication>;
    logout(request: LogoutRequest): Promise<void>;
    createUser(request: CreateUserRequest): Promise<IAuthentication>;
    changePassword(request: ChangePasswordRequest): Promise<void>;
    forgotPassword(request: ForgotPasswordRequest): Promise<void>;
    confirmPassword(request: ConfirmPasswordRequest): Promise<void>;
    deleteUser(request: DeleteUserRequest): Promise<void>;
    confirmDeleteUser(request: ConfirmDeleteUserRequest): Promise<void>;
}
