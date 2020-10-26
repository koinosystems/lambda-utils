import 'cross-fetch/polyfill';
import * as Axios from 'axios';
import * as AWS from 'aws-sdk';
import { AuthenticationDetails, CognitoRefreshToken, CognitoUser, CognitoUserAttribute, CognitoUserPool, } from 'amazon-cognito-identity-js';
const { AWS_REGION, COGNITO_POOL_ID, COGNITO_CLIENT_ID } = process.env;
export class CognitoAuthenticationClient {
    async getPublicKeys() {
        const { keys } = (await Axios.default.get(`https://cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO_POOL_ID}/.well-known/jwks.json`)).data;
        return keys;
    }
    refreshSession(username, refreshToken) {
        return new Promise((resolve, reject) => {
            try {
                const userPool = new CognitoUserPool({
                    UserPoolId: COGNITO_POOL_ID,
                    ClientId: COGNITO_CLIENT_ID,
                });
                const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
                return cognitoUser.refreshSession(new CognitoRefreshToken({ RefreshToken: refreshToken }), (err, result) => {
                    if (err) {
                        console.log('refreshSession ERROR', err);
                        return reject(err);
                    }
                    return resolve(result);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    authenticateUser(username, password) {
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
                    onSuccess: (result) => {
                        return resolve(result);
                    },
                    onFailure: (err) => {
                        console.log('authenticateUser ERROR', err);
                        return reject(err);
                    },
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    globalSignOut(username) {
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
            }
            catch (error) {
                reject(error);
            }
        });
    }
    adminConfirmSignUp(username) {
        return new Promise((resolve, reject) => {
            try {
                const client = new AWS.CognitoIdentityServiceProvider({
                    apiVersion: '2016-04-19',
                    region: AWS_REGION,
                });
                client.adminConfirmSignUp({
                    UserPoolId: COGNITO_POOL_ID,
                    Username: username,
                }, (err) => {
                    if (err) {
                        console.log('adminConfirmSignUp ERROR', err);
                        return reject(err);
                    }
                    return resolve();
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    signUp(attribute, username, password) {
        return new Promise((resolve, reject) => {
            try {
                const userPool = new CognitoUserPool({
                    UserPoolId: COGNITO_POOL_ID,
                    ClientId: COGNITO_CLIENT_ID,
                });
                userPool.signUp(username, password, [new CognitoUserAttribute({ Name: attribute, Value: username })], [], (err) => {
                    if (err) {
                        console.log('signUp ERROR', err);
                        return reject(err);
                    }
                    return resolve();
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    changePassword(username, oldPassword, newPassword) {
        return new Promise((resolve, reject) => {
            try {
                const userPool = new CognitoUserPool({
                    UserPoolId: COGNITO_POOL_ID,
                    ClientId: COGNITO_CLIENT_ID,
                });
                const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
                cognitoUser.changePassword(oldPassword, newPassword, (err) => {
                    if (err) {
                        console.log('changePassword ERROR', err);
                        return reject(err);
                    }
                    return resolve();
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    forgotPassword(username) {
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
                    onFailure: function (err) {
                        console.log('forgotPassword ERROR', err);
                        return reject(err);
                    },
                    inputVerificationCode() {
                        return resolve();
                    },
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    confirmPassword(username, verificationCode, password) {
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
                    onFailure: (err) => {
                        console.log('confirmPassword ERROR', err);
                        return reject(err);
                    },
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    adminDeleteUser(username) {
        return new Promise((resolve, reject) => {
            try {
                const client = new AWS.CognitoIdentityServiceProvider({
                    apiVersion: '2016-04-19',
                    region: AWS_REGION,
                });
                client.adminDeleteUser({
                    UserPoolId: COGNITO_POOL_ID,
                    Username: username,
                }, (err) => {
                    if (err) {
                        console.log('adminDeleteUser ERROR', err);
                        return reject(err);
                    }
                    return resolve();
                });
            }
            catch (error) {
                return reject(error);
            }
        });
    }
}
