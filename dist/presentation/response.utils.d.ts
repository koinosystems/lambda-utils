import { APIGatewayProxyResult } from 'aws-lambda';
export declare function formatReponse(statusCode: number, body: Object | string, isBase64Encoded?: boolean, headers?: any): Promise<JSON>;
export declare function formatResponseDownload(statusCode: number, body: Object, fileName: string): Promise<JSON>;
export declare function responseSuccess(statusCode?: number, data?: any, headers?: any): Promise<APIGatewayProxyResult>;
export declare function responseError(statusCode?: number, err?: Error, headers?: any): Promise<APIGatewayProxyResult>;
