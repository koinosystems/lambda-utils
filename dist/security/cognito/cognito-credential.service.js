import AWS from 'aws-sdk';
import { promisify } from 'util';
import * as Axios from 'axios';
import { AuthenticationDetails, CognitoRefreshToken, CognitoUser, CognitoUserAttribute, CognitoUserPool, } from 'amazon-cognito-identity-js';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import { ResponseError } from '../../presentation/response.error';
const { AWS_REGION, COGNITO_POOL_ID, COGNITO_CLIENT_ID } = process.env;
export class CognitoCredentialService {
    constructor() {
        this.verifyPromised = promisify(jwt.verify.bind(jwt));
        if (!COGNITO_POOL_ID || !COGNITO_CLIENT_ID) {
            throw new Error();
        }
        this.cognitoPool = COGNITO_POOL_ID;
        this.cognitoClient = COGNITO_CLIENT_ID;
    }
    async getPublicKeys() {
        const { keys } = (await Axios.default.get(`https://cognito-idp.${AWS_REGION}.amazonaws.com/${this.cognitoPool}/.well-known/jwks.json`)).data;
        return keys;
    }
    async verifyToken(request) {
        try {
            const currentSeconds = Math.floor(new Date().valueOf() / 1000);
            const tokenSections = request.token.split('.');
            const [jwtHeader] = tokenSections;
            const { kid } = JSON.parse(Buffer.from(jwtHeader, 'base64').toString('utf8'));
            if (!this.cacheKeys) {
                this.cacheKeys = await this.getPublicKeys();
                console.log('cacheKeys', this.cacheKeys);
            }
            const keyIndex = this.cacheKeys.findIndex((key) => key.kid === kid);
            if (keyIndex === -1)
                throw new ResponseError('Public key not found in jwks.json', 401);
            const pem = jwkToPem(this.cacheKeys[keyIndex]);
            const claim = (await this.verifyPromised(request.token, pem));
            if (!claim)
                throw new ResponseError('Invalid Token', 419);
            console.log('claim', claim);
            if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
                throw new ResponseError('Token expired', 401);
            }
            return Promise.resolve();
        }
        catch (err) {
            if (err.name === 'TokenExpiredError')
                throw new ResponseError('Token expired', 401);
            if (err.name === 'Error')
                throw new ResponseError('Invalid Token', 419);
            throw new ResponseError(err.message, 419);
        }
    }
    refreshToken(refreshToken, login) {
        return new Promise((resolve, reject) => {
            const userPool = new CognitoUserPool({
                UserPoolId: this.cognitoPool,
                ClientId: this.cognitoClient,
            });
            const cognitoUser = new CognitoUser({ Username: login, Pool: userPool });
            cognitoUser.refreshSession(new CognitoRefreshToken({ RefreshToken: refreshToken }), (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve({
                    login,
                    token: result.getIdToken().getJwtToken(),
                    refreshToken: result.getRefreshToken().getToken(),
                });
            });
        });
    }
    login(login, password) {
        return new Promise((resolve, reject) => {
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
                onSuccess: (result) => {
                    const idToken = result.getIdToken().getJwtToken();
                    const refreshToken = result.getRefreshToken().getToken();
                    return resolve({ token: idToken, refreshToken: refreshToken });
                },
                onFailure: (err) => {
                    return reject(err);
                },
            });
        });
    }
    logout(login) {
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
            }
            catch (err) {
                return reject(err);
            }
        });
    }
    createUser(login, password) {
        const cognitoUserAttributes = [new CognitoUserAttribute({ Name: 'email', Value: login })];
        const authenticationDetails = new AuthenticationDetails({
            Username: login,
            Password: password,
        });
        return new Promise((resolve, reject) => {
            const userPool = new CognitoUserPool({
                UserPoolId: this.cognitoPool,
                ClientId: this.cognitoClient,
            });
            userPool.signUp(login, password, cognitoUserAttributes, [], (signUpError, signUp) => {
                if (signUpError) {
                    reject(signUpError);
                }
                signUp?.user.authenticateUser(authenticationDetails, {
                    onSuccess: async (user) => {
                        return resolve({
                            login,
                            token: user.getIdToken().getJwtToken(),
                            refreshToken: user.getRefreshToken().getToken(),
                        });
                    },
                    onFailure: (userError) => {
                        reject(userError);
                    },
                });
            });
        });
    }
    changePassword(login, oldPassword, oldPasswordConfirmation, newPassword) {
        return new Promise((resolve, reject) => {
            if (oldPassword === newPassword)
                throw new ResponseError('oldPassword and newPassword are equals', 400);
            if (newPassword !== oldPasswordConfirmation)
                throw new ResponseError('newPassword and passwordConfirmation are not equals', 400);
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
                onSuccess: (result) => {
                    cognitoUser.changePassword(oldPassword, newPassword, (err) => {
                        if (err) {
                            return reject(err);
                        }
                        else {
                            return resolve();
                        }
                    });
                },
                onFailure: (err) => {
                    return reject(new ResponseError(err.message, 400));
                },
                newPasswordRequired: (userAttributes, requiredAttributes) => {
                    cognitoUser.completeNewPasswordChallenge(newPassword, requiredAttributes, {
                        onSuccess: (result) => {
                            return resolve();
                        },
                        onFailure: (err) => {
                            return reject(err);
                        },
                    });
                },
            });
        });
    }
    forgotPassword(login) {
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
    confirmPassword(login, verificationCode, oldPassword, oldPasswordConfirmation, newPassword) {
        return new Promise((resolve, reject) => {
            if (newPassword !== oldPasswordConfirmation)
                throw new ResponseError('newPassword and passwordConfirmarion are not equals', 400);
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
    deleteUser(login) {
        const client = new AWS.CognitoIdentityServiceProvider({
            apiVersion: '2016-04-19',
            region: 'us-east-1',
        });
        const params = {
            UserPoolId: this.cognitoPool,
            Username: login,
        };
        return new Promise((resolve, reject) => {
            client.adminDeleteUser(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    confirmDeleteUser(login, verificationCode) {
        throw new Error('Method not implemented.');
    }
}
