/* eslint-disable camelcase */
import AWS from 'aws-sdk';
import { promisify } from 'util';
import * as Axios from 'axios';
import {
  AuthenticationDetails,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  ISignUpResult,
} from 'amazon-cognito-identity-js';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import { ResponseError } from '../../presentation/response.error';
import {
  ChangePasswordRequest,
  ConfirmDeleteUserRequest,
  ConfirmPasswordRequest,
  CreateUserRequest,
  DeleteUserRequest,
  ForgotPasswordRequest,
  IAuthentication,
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
  VerifyTokenRequest,
} from '../authentication.model';
import { IAuthenticationService } from '../authentication.service';

const { AWS_REGION, COGNITO_POOL_ID, COGNITO_CLIENT_ID } = process.env;

interface PublicKey {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
}

interface PublicKeys {
  keys: PublicKey[];
}

export interface Claim {
  token_use: string;
  auth_time: number;
  iss: string;
  exp: number;
  username: string;
  client_id: string;
}

export class CognitoAuthenticationService implements IAuthenticationService {
  private cognitoPool: string;
  private cognitoClient: string;
  private cacheKeys?: PublicKey[];
  private verifyPromised = promisify(jwt.verify.bind(jwt));

  constructor() {
    if (!COGNITO_POOL_ID || !COGNITO_CLIENT_ID) {
      throw new Error();
    }
    this.cognitoPool = COGNITO_POOL_ID;
    this.cognitoClient = COGNITO_CLIENT_ID;
  }

  private async getPublicKeys(): Promise<PublicKey[]> {
    const { keys } = (
      await Axios.default.get<PublicKeys>(
        `https://cognito-idp.${AWS_REGION}.amazonaws.com/${this.cognitoPool}/.well-known/jwks.json`
      )
    ).data;
    return keys;
  }

  async verifyToken(request: VerifyTokenRequest): Promise<void> {
    try {
      // const [jwtHeader, jwtPayload, jwtSignature] = token.split('.');
      const currentSeconds = Math.floor(new Date().valueOf() / 1000);
      const tokenSections = request.token.split('.');

      const [jwtHeader] = tokenSections;
      const { kid } = JSON.parse(Buffer.from(jwtHeader, 'base64').toString('utf8'));

      if (!this.cacheKeys) {
        this.cacheKeys = await this.getPublicKeys();

        console.log('cacheKeys', this.cacheKeys);
      }

      const keyIndex = this.cacheKeys.findIndex((key: PublicKey) => key.kid === kid);
      if (keyIndex === -1) throw new ResponseError('Public key not found in jwks.json', 401);

      const pem = jwkToPem(this.cacheKeys[keyIndex] as jwkToPem.JWK);
      const claim = (await this.verifyPromised(request.token, pem)) as Claim;

      if (!claim) throw new ResponseError('Invalid Token', 419);
      console.log('claim', claim);

      if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
        throw new ResponseError('Token expired', 401);
      }

      return Promise.resolve();
    } catch (err) {
      if (err.name === 'TokenExpiredError') throw new ResponseError('Token expired', 401);
      if (err.name === 'Error') throw new ResponseError('Invalid Token', 419);
      throw new ResponseError(err.message, 419);
    }
  }

  refreshToken(request: RefreshTokenRequest): Promise<IAuthentication> {
    return new Promise<any>((resolve, reject) => {
      const userPool = new CognitoUserPool({
        UserPoolId: this.cognitoPool,
        ClientId: this.cognitoClient,
      });
      const cognitoUser = new CognitoUser({ Username: request.login, Pool: userPool });
      cognitoUser.refreshSession(
        new CognitoRefreshToken({ RefreshToken: request.refreshToken }),
        (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve({
            login: request.login,
            token: result.getIdToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          });
        }
      );
    });
  }

  login(request: LoginRequest): Promise<IAuthentication> {
    return new Promise<any>((resolve, reject) => {
      const userPool = new CognitoUserPool({
        UserPoolId: this.cognitoPool,
        ClientId: this.cognitoClient,
      });
      const cognitoUser = new CognitoUser({ Username: request.login, Pool: userPool });
      const authenticationDetails = new AuthenticationDetails({
        Username: request.login,
        Password: request.password,
      });
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result: any) => {
          const idToken = result.getIdToken().getJwtToken();
          const refreshToken = result.getRefreshToken().getToken();
          return resolve({ token: idToken, refreshToken: refreshToken });
        },
        onFailure: (err: any) => {
          return reject(err);
        },
      });
    });
  }

  logout(request: LogoutRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const userPool = new CognitoUserPool({
          UserPoolId: this.cognitoPool,
          ClientId: this.cognitoClient,
        });
        const cognitoUser = new CognitoUser({ Username: request.login, Pool: userPool });
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

  createUser(request: CreateUserRequest): Promise<IAuthentication> {
    const cognitoUserAttributes = [
      new CognitoUserAttribute({ Name: 'email', Value: request.login }),
    ];
    const authenticationDetails = new AuthenticationDetails({
      Username: request.login,
      Password: request.password,
    });
    return new Promise<IAuthentication>((resolve, reject) => {
      const userPool = new CognitoUserPool({
        UserPoolId: this.cognitoPool,
        ClientId: this.cognitoClient,
      });

      userPool.signUp(
        request.login,
        request.password,
        cognitoUserAttributes,
        [],
        (signUpError?: Error, signUp?: ISignUpResult) => {
          if (signUpError) {
            reject(signUpError);
          }
          signUp?.user.authenticateUser(authenticationDetails, {
            onSuccess: async (user: any) => {
              return resolve({
                login: request.login,
                token: user.getIdToken().getJwtToken(),
                refreshToken: user.getRefreshToken().getToken(),
              });
            },
            onFailure: (userError: Error) => {
              reject(userError);
            },
          });
        }
      );
    });
  }

  changePassword(request: ChangePasswordRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      // TODO remover quando rest estiver sendo utilizado
      if (request.oldPassword === request.newPassword)
        throw new ResponseError('oldPassword and newPassword are equals', 400);
      if (request.newPassword !== request.oldPasswordConfirmation)
        throw new ResponseError('newPassword and passwordConfirmation are not equals', 400);
      //   if (!this.verifyPasswordSecurity(newPassword))
      //     throw new ResponseError(
      //       'The password is not valid. Password must have leastwise 8 characters,  1 uppercase character, 1 lowercase character and 1 number. ',
      //       400
      //     );
      const userPool = new CognitoUserPool({
        UserPoolId: this.cognitoPool,
        ClientId: this.cognitoClient,
      });

      const cognitoUser = new CognitoUser({ Username: request.login, Pool: userPool });
      const authenticationDetails = new AuthenticationDetails({
        Username: request.login,
        Password: request.oldPassword,
      });
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result: any) => {
          // const idToken = result.getIdToken().getJwtToken()
          cognitoUser.changePassword(request.oldPassword, request.newPassword, (err) => {
            if (err) {
              return reject(err);
            } else {
              return resolve();
            }
          });
        },
        onFailure: (err: Error) => {
          return reject(new ResponseError(err.message, 400));
        },
        newPasswordRequired: (userAttributes: any, requiredAttributes: any) => {
          cognitoUser.completeNewPasswordChallenge(request.newPassword, requiredAttributes, {
            onSuccess: (result: any) => {
              return resolve();
            },
            onFailure: (err: any) => {
              return reject(err);
            },
          });
        },
      });
    });
  }

  forgotPassword(request: ForgotPasswordRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      const userPool = new CognitoUserPool({
        UserPoolId: this.cognitoPool,
        ClientId: this.cognitoClient,
      });
      const cognitoUser = new CognitoUser({ Username: request.login, Pool: userPool });
      cognitoUser.forgotPassword({
        onSuccess: function (result) {
          console.log('call result: ' + result);
        },
        onFailure: function (err) {
          return reject(err);
        },
        inputVerificationCode() {
          return resolve();
        },
      });
    });
  }

  confirmPassword(request: ConfirmPasswordRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      // TODO remover quando utilizarem rest
      if (request.newPassword !== request.oldPasswordConfirmation)
        throw new ResponseError('newPassword and passwordConfirmarion are not equals', 400);
      //   if (!this.verifyPasswordSecurity(newPassword))
      //     throw new ResponseError(
      //       'The password is not valid. Password must have leastwise 8 characters,  1 uppercase character, 1 lowercase character and 1 number. ',
      //       400
      //     );
      const userPool = new CognitoUserPool({
        UserPoolId: this.cognitoPool,
        ClientId: this.cognitoClient,
      });

      const cognitoUser = new CognitoUser({ Username: request.login, Pool: userPool });
      cognitoUser.confirmPassword(request.verificationCode, request.newPassword, {
        onSuccess: () => {
          resolve();
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  deleteUser(request: DeleteUserRequest): Promise<void> {
    const client = new AWS.CognitoIdentityServiceProvider({
      apiVersion: '2016-04-19',
      region: 'us-east-1',
    });
    const params = {
      UserPoolId: this.cognitoPool,
      Username: request.login,
    };
    return new Promise<void>((resolve, reject) => {
      client.adminDeleteUser(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  confirmDeleteUser(request: ConfirmDeleteUserRequest): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
