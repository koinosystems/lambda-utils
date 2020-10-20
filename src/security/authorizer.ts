/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { OSError } from '../presentation/os-error';
import { ICredential, ICredentialService, IRole } from './credential';

export class Authorizer {
  constructor(private credentialService: ICredentialService) {}

  public async authorizeByAllowedRoles(allowedRoles: IRole[]): Promise<ICredential> {
    try {
      const credential = await this.credentialService.getCredential();
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

  public async authorizeByForbiddenRoles(forbiddenRoles: IRole[]): Promise<ICredential> {
    try {
      const credential = await this.credentialService.getCredential();
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

  public async authorizeByUserId(id: string): Promise<ICredential> {
    const credential = await this.credentialService.getCredential();
    if (id !== credential.userId) {
      throw new Error('Unauthorized');
    }
    return Promise.resolve(credential);
  }
}
