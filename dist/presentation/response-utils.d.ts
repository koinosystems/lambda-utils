import { APIGatewayProxyResult } from 'aws-lambda';
export declare function formatReponse(statusCode: number, body: Object | string, isBase64Encoded?: boolean, headers?: any): JSON;
export declare function formatResponseDownload(statusCode: number, body: Object, fileName: string): JSON;
export declare function responseSuccess(statusCode?: number, headers?: any, data?: any): APIGatewayProxyResult;
export declare function responseError(statusCode?: number, headers?: any, err?: Error): APIGatewayProxyResult;
