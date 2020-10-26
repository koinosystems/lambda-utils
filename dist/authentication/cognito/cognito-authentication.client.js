"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CognitoAuthenticationClient = void 0;
/* eslint-disable camelcase */
require("cross-fetch/polyfill");
const Axios = __importStar(require("axios"));
const AWS = __importStar(require("aws-sdk"));
const amazon_cognito_identity_js_1 = require("amazon-cognito-identity-js");
const { AWS_REGION, COGNITO_POOL_ID, COGNITO_CLIENT_ID } = process.env;
class CognitoAuthenticationClient {
    getPublicKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            const { keys } = (yield Axios.default.get(`https://cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO_POOL_ID}/.well-known/jwks.json`)).data;
            return keys;
        });
    }
    refreshSession(username, refreshToken) {
        return new Promise((resolve, reject) => {
            try {
                const userPool = new amazon_cognito_identity_js_1.CognitoUserPool({
                    UserPoolId: COGNITO_POOL_ID,
                    ClientId: COGNITO_CLIENT_ID,
                });
                const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser({ Username: username, Pool: userPool });
                return cognitoUser.refreshSession(new amazon_cognito_identity_js_1.CognitoRefreshToken({ RefreshToken: refreshToken }), (err, result) => {
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
                const authenticationDetails = new amazon_cognito_identity_js_1.AuthenticationDetails({
                    Username: username,
                    Password: password,
                });
                const userPool = new amazon_cognito_identity_js_1.CognitoUserPool({
                    UserPoolId: COGNITO_POOL_ID,
                    ClientId: COGNITO_CLIENT_ID,
                });
                const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser({ Username: username, Pool: userPool });
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
                const userPool = new amazon_cognito_identity_js_1.CognitoUserPool({
                    UserPoolId: COGNITO_POOL_ID,
                    ClientId: COGNITO_CLIENT_ID,
                });
                const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser({ Username: username, Pool: userPool });
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
                const userPool = new amazon_cognito_identity_js_1.CognitoUserPool({
                    UserPoolId: COGNITO_POOL_ID,
                    ClientId: COGNITO_CLIENT_ID,
                });
                userPool.signUp(username, password, [new amazon_cognito_identity_js_1.CognitoUserAttribute({ Name: attribute, Value: username })], [], (err) => {
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
                const userPool = new amazon_cognito_identity_js_1.CognitoUserPool({
                    UserPoolId: COGNITO_POOL_ID,
                    ClientId: COGNITO_CLIENT_ID,
                });
                const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser({ Username: username, Pool: userPool });
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
                const userPool = new amazon_cognito_identity_js_1.CognitoUserPool({
                    UserPoolId: COGNITO_POOL_ID,
                    ClientId: COGNITO_CLIENT_ID,
                });
                const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser({ Username: username, Pool: userPool });
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
                const userPool = new amazon_cognito_identity_js_1.CognitoUserPool({
                    UserPoolId: COGNITO_POOL_ID,
                    ClientId: COGNITO_CLIENT_ID,
                });
                const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser({ Username: username, Pool: userPool });
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
exports.CognitoAuthenticationClient = CognitoAuthenticationClient;
//# sourceMappingURL=cognito-authentication.client.js.map