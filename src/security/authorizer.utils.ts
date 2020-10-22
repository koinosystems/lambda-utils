/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { OSError } from '../presentation/os.error';
import { ICredential, IRole } from './credential';

export class AuthorizerUtils {
  public async authorizeByAllowedRoles(
    credential: ICredential,
    allowedRoles: IRole[]
  ): Promise<ICredential> {
    try {
      for (const allowedRole of allowedRoles) {
        if (credential.role === allowedRole) {
          return Promise.resolve(credential);
        }
      }
      throw new OSError('Unauthorized', 401);
    } catch (err) {
      console.log('||error|| ', err);
      throw new OSError(err.message, err.code ? err.code : err.name ? parseInt(err.name) : 500);
    }
  }

  public async authorizeByForbiddenRoles(
    credential: ICredential,
    forbiddenRoles: IRole[]
  ): Promise<ICredential> {
    try {
      for (const forbiddenRole of forbiddenRoles) {
        if (credential.role === forbiddenRole) {
          throw new Error('Unauthorized');
        }
      }
      return Promise.resolve(credential);
    } catch (err) {
      console.log('||error|| ', err);
      throw new OSError(err.message, err.code ? err.code : err.name ? parseInt(err.name) : 500);
    }
  }

  public async authorizeByUserId(credential: ICredential, id: string): Promise<ICredential> {
    if (id !== credential.userId) {
      throw new Error('Unauthorized');
    }
    return Promise.resolve(credential);
  }
}
