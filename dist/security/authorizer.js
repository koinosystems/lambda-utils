import { OSError } from '../presentation/os-error';
export class Authorizer {
    constructor(credentialService) {
        this.credentialService = credentialService;
    }
    async authorizeByAllowedRoles(allowedRoles) {
        try {
            const credential = await this.credentialService.getCredential();
            for (const allowedRole of allowedRoles) {
                if (credential.role === allowedRole) {
                    return Promise.resolve(credential);
                }
            }
            throw new OSError('Unauthorized', 401);
        }
        catch (err) {
            console.log('||error|| ', err);
            throw new OSError(err.message, err.code ? err.code : err.name ? parseInt(err.name) : 500);
        }
    }
    async authorizeByForbiddenRoles(forbiddenRoles) {
        try {
            const credential = await this.credentialService.getCredential();
            for (const forbiddenRole of forbiddenRoles) {
                if (credential.role === forbiddenRole) {
                    throw new Error('Unauthorized');
                }
            }
            return Promise.resolve(credential);
        }
        catch (err) {
            console.log('||error|| ', err);
            throw new OSError(err.message, err.code ? err.code : err.name ? parseInt(err.name) : 500);
        }
    }
    async authorizeByUserId(id) {
        const credential = await this.credentialService.getCredential();
        if (id !== credential.userId) {
            throw new Error('Unauthorized');
        }
        return Promise.resolve(credential);
    }
}
