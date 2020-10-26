import { AuthenticationDetails, CognitoRefreshToken, CognitoUser, CognitoUserAttribute, CognitoUserPool, } from 'amazon-cognito-identity-js';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
const { AWS_REGION, COGNITO_POOL_ID, COGNITO_CLIENT_ID } = process.env;
export class CognitoAuthenticationClient {
    constructor() {
        this.client = new CognitoIdentityServiceProvider({
            apiVersion: '2016-04-19',
            region: AWS_REGION,
        });
        this.userPool = new CognitoUserPool({
            UserPoolId: COGNITO_POOL_ID,
            ClientId: COGNITO_CLIENT_ID,
        });
    }
    refreshSession(username, refreshToken) {
        return new Promise((resolve, reject) => {
            try {
                const cognitoUser = new CognitoUser({ Username: username, Pool: this.userPool });
                cognitoUser.refreshSession(new CognitoRefreshToken({ RefreshToken: refreshToken }), (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result);
                });
            }
            catch (err) {
                return reject(err);
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
                const cognitoUser = new CognitoUser({ Username: username, Pool: this.userPool });
                cognitoUser.authenticateUser(authenticationDetails, {
                    onSuccess: (result) => {
                        return resolve(result);
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
    globalSignOut(username) {
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
            }
            catch (err) {
                return reject(err);
            }
        });
    }
    adminConfirmSignUp(username) {
        return new Promise((resolve, reject) => {
            try {
                this.client.adminConfirmSignUp({
                    UserPoolId: COGNITO_POOL_ID,
                    Username: username,
                }, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    else {
                        return resolve();
                    }
                });
            }
            catch (err) {
                return reject(err);
            }
        });
    }
    signUp(attribute, username, password) {
        return new Promise((resolve, reject) => {
            try {
                this.userPool.signUp(username, password, [new CognitoUserAttribute({ Name: attribute, Value: username })], [], async (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(result);
                });
            }
            catch (err) {
                return reject(err);
            }
        });
    }
    changePassword(username, oldPassword, newPassword) {
        return new Promise((resolve, reject) => {
            try {
                const cognitoUser = new CognitoUser({ Username: username, Pool: this.userPool });
                cognitoUser.changePassword(oldPassword, newPassword, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    else {
                        return resolve();
                    }
                });
            }
            catch (err) {
                return reject(err);
            }
        });
    }
    forgotPassword(username) {
        return new Promise((resolve, reject) => {
            try {
                const cognitoUser = new CognitoUser({ Username: username, Pool: this.userPool });
                cognitoUser.forgotPassword({
                    onSuccess: function () { },
                    onFailure: function (err) {
                        return reject(err);
                    },
                    inputVerificationCode() {
                        return resolve();
                    },
                });
            }
            catch (err) {
                return reject(err);
            }
        });
    }
    confirmPassword(username, verificationCode, password) {
        return new Promise((resolve, reject) => {
            try {
                const cognitoUser = new CognitoUser({ Username: username, Pool: this.userPool });
                cognitoUser.confirmPassword(verificationCode, password, {
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
    adminDeleteUser(username) {
        return new Promise((resolve, reject) => {
            try {
                this.client.adminDeleteUser({
                    UserPoolId: COGNITO_POOL_ID,
                    Username: username,
                }, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve();
                });
            }
            catch (err) {
                return reject(err);
            }
        });
    }
}