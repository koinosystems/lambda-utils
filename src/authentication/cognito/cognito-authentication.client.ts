/* eslint-disable camelcase */
import 'cross-fetch/polyfill';
import * as Axios from 'axios';
import * as AWS from 'aws-sdk';
import {
  AuthenticationDetails,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';

const { AWS_REGION, COGNITO_POOL_ID, COGNITO_CLIENT_ID } = process.env;

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

export class CognitoAuthenticationClient {
  async getPublicKeys(): Promise<CognitoPublicKey[]> {
    const { keys } = (
      await Axios.default.get<CognitoPublicKeys>(
        `https://cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO_POOL_ID}/.well-known/jwks.json`
      )
    ).data;
    return keys;
  }

  refreshSession(username: string, refreshToken: string): Promise<CognitoUserSession> {
    return new Promise((resolve, reject) => {
      try {
        const userPool = new CognitoUserPool({
          UserPoolId: COGNITO_POOL_ID,
          ClientId: COGNITO_CLIENT_ID,
        });
        const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
        return cognitoUser.refreshSession(
          new CognitoRefreshToken({ RefreshToken: refreshToken }),
          (err: Error, result: CognitoUserSession) => {
            if (err) {
              console.log('refreshSession ERROR', err);
              return reject(err);
            }
            return resolve(result);
          }
        );
      } catch (error: any) {
        reject(error);
      }
    });
  }

  authenticateUser(username: string, password: string): Promise<CognitoUserSession> {
    return new Promise((resolve, reject) => {
      try {
        const authenticationDetails = new AuthenticationDetails({
          Username: username,
          Password: password,
        });
        const userPool = new CognitoUserPool({
          UserPoolId: COGNITO_POOL_ID,
          ClientId: COGNITO_CLIENT_ID,
        });
        const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
        return cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: (result: CognitoUserSession) => {
            return resolve(result);
          },
          onFailure: (err: any) => {
            console.log('authenticateUser ERROR', err);
            return reject(err);
          },
        });
      } catch (error: any) {
        reject(error);
      }
    });
  }

  globalSignOut(username: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const userPool = new CognitoUserPool({
          UserPoolId: COGNITO_POOL_ID,
          ClientId: COGNITO_CLIENT_ID,
        });
        const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
        cognitoUser.globalSignOut({
          onSuccess: () => {
            return resolve();
          },
          onFailure: (err) => {
            console.log('globalSignOut ERROR', err);
            return reject(err);
          },
        });
      } catch (error: any) {
        reject(error);
      }
    });
  }

  adminConfirmSignUp(username: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const client = new AWS.CognitoIdentityServiceProvider({
          apiVersion: '2016-04-19',
          region: AWS_REGION,
        });
        client.adminConfirmSignUp(
          {
            UserPoolId: COGNITO_POOL_ID,
            Username: username,
          },
          (err: Error) => {
            if (err) {
              console.log('adminConfirmSignUp ERROR', err);
              return reject(err);
            }
            return resolve();
          }
        );
      } catch (error: any) {
        reject(error);
      }
    });
  }

  signUp(attribute: string, username: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const userPool = new CognitoUserPool({
          UserPoolId: COGNITO_POOL_ID,
          ClientId: COGNITO_CLIENT_ID,
        });
        userPool.signUp(
          username,
          password,
          [new CognitoUserAttribute({ Name: attribute, Value: username })],
          [],
          (err?: Error) => {
            if (err) {
              console.log('signUp ERROR', err);
              return reject(err);
            }
            return resolve();
          }
        );
      } catch (error: any) {
        reject(error);
      }
    });
  }

  changePassword(username: string, oldPassword: string, newPassword: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const userPool = new CognitoUserPool({
          UserPoolId: COGNITO_POOL_ID,
          ClientId: COGNITO_CLIENT_ID,
        });
        const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
        cognitoUser.changePassword(oldPassword, newPassword, (err?: Error) => {
          if (err) {
            console.log('changePassword ERROR', err);
            return reject(err);
          }
          return resolve();
        });
      } catch (error: any) {
        reject(error);
      }
    });
  }

  forgotPassword(username: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const userPool = new CognitoUserPool({
          UserPoolId: COGNITO_POOL_ID,
          ClientId: COGNITO_CLIENT_ID,
        });
        const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
        cognitoUser.forgotPassword({
          onSuccess: function () {
            return resolve();
          },
          onFailure: function (err: Error) {
            console.log('forgotPassword ERROR', err);
            return reject(err);
          },
          inputVerificationCode() {
            return resolve();
          },
        });
      } catch (error: any) {
        reject(error);
      }
    });
  }

  confirmPassword(username: string, verificationCode: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const userPool = new CognitoUserPool({
          UserPoolId: COGNITO_POOL_ID,
          ClientId: COGNITO_CLIENT_ID,
        });
        const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
        cognitoUser.confirmPassword(verificationCode, password, {
          onSuccess: () => {
            return resolve();
          },
          onFailure: (err: Error) => {
            console.log('confirmPassword ERROR', err);
            return reject(err);
          },
        });
      } catch (error: any) {
        reject(error);
      }
    });
  }

  adminDeleteUser(username: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const client = new AWS.CognitoIdentityServiceProvider({
          apiVersion: '2016-04-19',
          region: AWS_REGION,
        });
        client.adminDeleteUser(
          {
            UserPoolId: COGNITO_POOL_ID,
            Username: username,
          },
          (err: Error) => {
            if (err) {
              console.log('adminDeleteUser ERROR', err);
              return reject(err);
            }
            return resolve();
          }
        );
      } catch (error: any) {
        return reject(error);
      }
    });
  }
}
