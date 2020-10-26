/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */

export enum IRole {
  User,
  Basic,
  Advanced,
  Anonymous,
}

export interface IAuthentication {
  login: string;
  token: string;
  refreshToken: string;
  role?: IRole;
  [key: string]: any;
}

export interface VerifyTokenRequest {
  readonly token: string;
}

export interface RefreshTokenRequest {
  readonly refreshToken: string;
  readonly login: string;
}

export interface LoginRequest {
  readonly login: string;
  readonly password: string;
}

export interface LogoutRequest {
  readonly login: string;
}

export interface CreateUserRequest {
  readonly login: string;
  readonly password: string;
}

export interface ChangePasswordRequest {
  readonly login: string;
  readonly oldPassword: string;
  readonly oldPasswordConfirmation: string;
  readonly newPassword: string;
}

export interface ForgotPasswordRequest {
  readonly login: string;
}

export interface ConfirmPasswordRequest {
  readonly login: string;
  readonly verificationCode: string;
  readonly oldPassword: string;
  readonly oldPasswordConfirmation: string;
  readonly newPassword: string;
}

export interface DeleteUserRequest {
  readonly login: string;
}

export interface ConfirmDeleteUserRequest {
  readonly login: string;
  readonly verificationCode?: string;
}
