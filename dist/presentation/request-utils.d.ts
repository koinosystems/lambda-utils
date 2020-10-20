import { Authorizer } from '../security/authorizer';
export interface BaseHeaders {
    identityProvider: string;
    token: string;
}
export interface BaseBody {
    query: string;
    variables: {
        [key: string]: any;
    };
}
export interface BaseContext {
    authorizer: Authorizer;
}
export declare function parseBody<T>(body: string, model: {
    new (): T;
}): Promise<T>;
export declare class BaseRequest {
    body: BaseBody;
    headers: BaseHeaders;
    constructor(query: string, variables: {
        [key: string]: any;
    }, identityProvider: string, token: string);
}
