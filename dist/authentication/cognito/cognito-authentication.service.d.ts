import { ChangePasswordRequest, ConfirmDeleteUserRequest, ConfirmPasswordRequest, CreateUserRequest, DeleteUserRequest, ForgotPasswordRequest, IAuthentication, LoginRequest, LogoutRequest, RefreshTokenRequest, VerifyTokenRequest } from '../authentication.model';
import { IAuthenticationService } from '../authentication.service';
export interface Claim {
    token_use: string;
    auth_time: number;
    iss: string;
    exp: number;
    username: string;
    client_id: string;
}
export declare class CognitoAuthenticationService implements IAuthenticationService {
    private cognitoPool;
    private cognitoClient;
    private cacheKeys?;
    private verifyPromised;
    constructor();
    private getPublicKeys;
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
