/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseError } from '../presentation/response.error';
import { ICredential, IRole } from './credential.service';

export class AuthorizerUtils {
  public async authorizeByAllowedRoles(
    credential: ICredential,
    allowedRoles: IRole[]
  ): Promise<void> {
    try {
      for (const allowedRole of allowedRoles) {
        if (credential.role === allowedRole) {
          return;
        }
      }
      throw new ResponseError('Unauthorized', 401);
    } catch (err) {
      throw new ResponseError(
        err.message,
        err.code ? err.code : err.name ? parseInt(err.name) : 500
      );
    }
  }

  public async authorizeByForbiddenRoles(
    credential: ICredential,
    forbiddenRoles: IRole[]
  ): Promise<void> {
    try {
      for (const forbiddenRole of forbiddenRoles) {
        if (credential.role === forbiddenRole) {
          throw new ResponseError('Unauthorized', 401);
        }
      }
    } catch (err) {
      throw new ResponseError(
        err.message,
        err.code ? err.code : err.name ? parseInt(err.name) : 500
      );
    }
  }

  public async authorizeByUserId(credential: ICredential, id: string): Promise<void> {
    if (id !== credential.userId) {
      throw new ResponseError('Unauthorized', 401);
    }
  }
}
