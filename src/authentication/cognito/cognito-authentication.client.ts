import {
  AuthenticationDetails,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  ISignUpResult,
} from 'amazon-cognito-identity-js';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';

const { AWS_REGION, COGNITO_POOL_ID, COGNITO_CLIENT_ID } = process.env;

export class CognitoAuthenticationClient {
  private client = new CognitoIdentityServiceProvider({
    apiVersion: '2016-04-19',
    region: AWS_REGION,
  });

  private userPool = new CognitoUserPool({
    UserPoolId: COGNITO_POOL_ID!,
    ClientId: COGNITO_CLIENT_ID!,
  });

  refreshSession(username: string, refreshToken: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      try {
        const cognitoUser = new CognitoUser({ Username: username, Pool: this.userPool });
        cognitoUser.refreshSession(
          new CognitoRefreshToken({ RefreshToken: refreshToken }),
          (err, result) => {
            if (err) {
              return reject(err);
            }
            return resolve(result);
          }
        );
      } catch (err) {
        return reject(err);
      }
    });
  }

  authenticateUser(username: string, password: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      try {
        const authenticationDetails = new AuthenticationDetails({
          Username: username,
          Password: password,
        });
        const cognitoUser = new CognitoUser({ Username: username, Pool: this.userPool });
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: (result: any) => {
            return resolve(result);
          },
          onFailure: (err: any) => {
            return reject(err);
          },
        });
      } catch (err) {
        return reject(err);
      }
    });
  }

  globalSignOut(username: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const cognitoUser = new CognitoUser({ Username: username, Pool: this.userPool });
        cognitoUser.globalSignOut({
          onSuccess: () => {
            return resolve();
          },
          onFailure: (err) => {
            return reject(err);
          },
        });
      } catch (err) {
        return reject(err);
      }
    });
  }

  adminConfirmSignUp(username: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this.client.adminConfirmSignUp(
          {
            UserPoolId: COGNITO_POOL_ID!,
            Username: username,
          },
          (err: Error) => {
            if (err) {
              return reject(err);
            } else {
              return resolve();
            }
          }
        );
      } catch (err) {
        return reject(err);
      }
    });
  }

  signUp(attribute: string, username: string, password: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      try {
        this.userPool.signUp(
          username,
          password,
          [new CognitoUserAttribute({ Name: attribute, Value: username })],
          [],
          async (error?: Error, result?: ISignUpResult) => {
            if (error) {
              return reject(error);
            }
            return resolve(result);
          }
        );
      } catch (err) {
        return reject(err);
      }
    });
  }

  changePassword(username: string, oldPassword: string, newPassword: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const cognitoUser = new CognitoUser({ Username: username, Pool: this.userPool });
        cognitoUser.changePassword(oldPassword, newPassword, (err?: Error) => {
          if (err) {
            return reject(err);
          } else {
            return resolve();
          }
        });
      } catch (err) {
        return reject(err);
      }
    });
  }

  forgotPassword(username: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const cognitoUser = new CognitoUser({ Username: username, Pool: this.userPool });
        cognitoUser.forgotPassword({
          onSuccess: function () {},
          onFailure: function (err: Error) {
            return reject(err);
          },
          inputVerificationCode() {
            return resolve();
          },
        });
      } catch (err) {
        return reject(err);
      }
    });
  }

  confirmPassword(username: string, verificationCode: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const cognitoUser = new CognitoUser({ Username: username, Pool: this.userPool });
        cognitoUser.confirmPassword(verificationCode, password, {
          onSuccess: () => {
            return resolve();
          },
          onFailure: (err: Error) => {
            return reject(err);
          },
        });
      } catch (err) {
        return reject(err);
      }
    });
  }

  adminDeleteUser(username: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this.client.adminDeleteUser(
          {
            UserPoolId: COGNITO_POOL_ID!,
            Username: username,
          },
          (err: Error) => {
            if (err) {
              return reject(err);
            }
            return resolve();
          }
        );
      } catch (err) {
        return reject(err);
      }
    });
  }
}
