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
import {
  Claim,
  ClaimVerifyRequest,
  ICredential,
  ICredentialService,
  PublicKey,
  PublicKeys,
} from '../credential.service';
import { ResponseError } from '../../presentation/response.error';

const { AWS_REGION, COGNITO_POOL_ID, COGNITO_CLIENT_ID } = process.env;

export class CognitoCredentialService implements ICredentialService {
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

  async getPublicKeys(): Promise<PublicKey[]> {
    const { keys } = (
      await Axios.default.get<PublicKeys>(
        `https://cognito-idp.${AWS_REGION}.amazonaws.com/${this.cognitoPool}/.well-known/jwks.json`
      )
    ).data;
    return keys;
  }

  async verifyToken(request: ClaimVerifyRequest): Promise<void> {
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

  refreshToken(refreshToken: string, login: string): Promise<ICredential> {
    return new Promise<any>((resolve, reject) => {
      const userPool = new CognitoUserPool({
        UserPoolId: this.cognitoPool,
        ClientId: this.cognitoClient,
      });
      const cognitoUser = new CognitoUser({ Username: login, Pool: userPool });
      cognitoUser.refreshSession(
        new CognitoRefreshToken({ RefreshToken: refreshToken }),
        (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve({
            login,
            token: result.getIdToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          });
        }
      );
    });
  }

  login(login: string, password: string): Promise<ICredential> {
    return new Promise<any>((resolve, reject) => {
      const userPool = new CognitoUserPool({
        UserPoolId: this.cognitoPool,
        ClientId: this.cognitoClient,
      });
      const cognitoUser = new CognitoUser({ Username: login, Pool: userPool });
      const authenticationDetails = new AuthenticationDetails({
        Username: login,
        Password: password,
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

  logout(login: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const userPool = new CognitoUserPool({
          UserPoolId: this.cognitoPool,
          ClientId: this.cognitoClient,
        });
        const cognitoUser = new CognitoUser({ Username: login, Pool: userPool });
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

  createUser(login: string, password: string): Promise<ICredential> {
    const cognitoUserAttributes = [new CognitoUserAttribute({ Name: 'email', Value: login })];
    const authenticationDetails = new AuthenticationDetails({
      Username: login,
      Password: password,
    });
    return new Promise<ICredential>((resolve, reject) => {
      const userPool = new CognitoUserPool({
        UserPoolId: this.cognitoPool,
        ClientId: this.cognitoClient,
      });

      userPool.signUp(
        login,
        password,
        cognitoUserAttributes,
        [],
        (signUpError?: Error, signUp?: ISignUpResult) => {
          if (signUpError) {
            reject(signUpError);
          }
          signUp?.user.authenticateUser(authenticationDetails, {
            onSuccess: async (user: any) => {
              return resolve({
                login,
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

  changePassword(
    login: string,
    oldPassword: string,
    oldPasswordConfirmation: string,
    newPassword: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // TODO remover quando rest estiver sendo utilizado
      if (oldPassword === newPassword)
        throw new ResponseError('oldPassword and newPassword are equals', 400);
      if (newPassword !== oldPasswordConfirmation)
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

      const cognitoUser = new CognitoUser({ Username: login, Pool: userPool });
      const authenticationDetails = new AuthenticationDetails({
        Username: login,
        Password: oldPassword,
      });
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result: any) => {
          // const idToken = result.getIdToken().getJwtToken()
          cognitoUser.changePassword(oldPassword, newPassword, (err) => {
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
          cognitoUser.completeNewPasswordChallenge(newPassword, requiredAttributes, {
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

  forgotPassword(login: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const userPool = new CognitoUserPool({
        UserPoolId: this.cognitoPool,
        ClientId: this.cognitoClient,
      });
      const cognitoUser = new CognitoUser({ Username: login, Pool: userPool });
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

  confirmPassword(
    login: string,
    verificationCode: string,
    oldPassword: string,
    oldPasswordConfirmation: string,
    newPassword: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // TODO remover quando utilizarem rest
      if (newPassword !== oldPasswordConfirmation)
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

      const cognitoUser = new CognitoUser({ Username: login, Pool: userPool });
      cognitoUser.confirmPassword(verificationCode, newPassword, {
        onSuccess: () => {
          resolve();
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  deleteUser(login: string): Promise<void> {
    const client = new AWS.CognitoIdentityServiceProvider({
      apiVersion: '2016-04-19',
      region: 'us-east-1',
    });
    const params = {
      UserPoolId: this.cognitoPool,
      Username: login,
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

  confirmDeleteUser(login: string, verificationCode?: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
