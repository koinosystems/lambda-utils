/* eslint-disable new-cap */
import { validate } from 'class-validator';
import { Authorizer } from '../security/authorizer';

export interface BaseHeaders {
  identityProvider: string;
  token: string;
}

export interface BaseBody {
  query: string;
  variables: { [key: string]: any };
}

export interface BaseContext {
  authorizer: Authorizer;
}

async function validateBody(body: string, inputModel: any): Promise<void> {
  let parsedBody: any = {};
  if (!body) {
    throw new Error('Body object is null, check if method is POST');
  }
  try {
    parsedBody = JSON.parse(body);
  } catch (err) {
    throw new Error('MalformedJSON');
  }
  for (const key in parsedBody) {
    inputModel[key] = parsedBody[key];
  }
  await validate(inputModel, { validationError: { target: false } }).then((errors) => {
    if (errors.length > 0) {
      throw new Error(JSON.stringify(errors));
    }
  });
}

export async function parseBody<T>(body: string, model: { new (): T }): Promise<T> {
  const object = new model();
  await validateBody(body, object);
  return object;
}

export class BaseRequest {
  body: BaseBody;
  headers: BaseHeaders;

  constructor(
    query: string,
    variables: { [key: string]: any },
    identityProvider: string,
    token: string
  ) {
    this.body = {
      query: query,
      variables: variables,
    };
    this.headers = {
      identityProvider: identityProvider,
      token: token,
    };
  }
}
