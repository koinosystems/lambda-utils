/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

export enum IRole {
  User,
  Basic,
  Advanced,
  Anonymous,
}

export interface ICredential {
  login: string;
  role: IRole;
  token: string;
  refreshToken: string;
  [key: string]: any;
}

export interface ICredentialService {
  getToken(): Promise<any>;

  verifyToken(): Promise<any>;

  refreshToken(refreshToken: string, login: string): Promise<any>;

  getCredential(): Promise<ICredential>;

  login(login: string, password: string): Promise<ICredential>;

  logout(login: string): Promise<void>;

  createUser(login: string, password: string): Promise<void>;

  changePassword(
    login: string,
    oldPassword: string,
    oldPasswordConfirmation: string,
    newPassword: string
  ): Promise<void>;

  forgotPassword(login: string): Promise<void>;

  confirmPassword(
    login: string,
    verificationCode: string,
    oldPassword: string,
    oldPasswordConfirmation: string,
    newPassword: string
  ): Promise<void>;

  deleteUser(login: string): Promise<void>;

  confirmDeleteUser(login: string, verificationCode?: string): Promise<void>;
}
