/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIGatewayProxyResult } from 'aws-lambda'

export function formatReponse (
  statusCode: number,
  body: Object | string,
  isBase64Encoded?: boolean,
  headers?: any
): JSON {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, identity-provider, token, Identity-Provider, Token',
    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT'
  }
  return JSON.parse(
    JSON.stringify({
      statusCode: statusCode,
      body: JSON.stringify(body),
      isBase64Encoded: isBase64Encoded || false,
      headers: corsHeaders
    })
  )
}

export function formatResponseDownload (
  statusCode: number,
  body: Object,
  fileName: string
): JSON {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, identity-provider, token, Identity-Provider, Token',
    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
    'Content-disposition': `attachment; filename=${fileName}`,
    'Content-Type': 'application/zip, application/octet-stream',
    'Accept-Encoding': 'application/zip, application/octet-stream'
  }
  return JSON.parse(
    JSON.stringify({
      statusCode: statusCode,
      body: body,
      isBase64Encoded: false,
      headers: corsHeaders
    })
  )
}

export function responseSuccess (
  statusCode = 200,
  headers: any = {},
  data: any = {}
): APIGatewayProxyResult {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, identity-provider, token, Identity-Provider, Token',
    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT'
  }
  const response: {
    statusCode: number;
    headers: any;
    body: any;
  } = {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...headers
    },
    body: JSON.stringify({
      data
    })
  }
  return response
}

export function responseError (
  statusCode = 500,
  headers: any = {},
  err?: Error
): APIGatewayProxyResult {
  console.log(err)

  const response: {
    statusCode: number;
    headers: any;
    body: any;
  } = {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify({
      error: err
    })
  }

  if (statusCode === 500) {
    response.body = JSON.stringify({
      error: {
        message:
          'There was an internal server error. Please try again later. If the problem persists, please contact technical support.'
      }
    })
  }

  return response
}