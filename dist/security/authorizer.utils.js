import { OSError } from '../presentation/os.error';
export class AuthorizerUtils {
    async authorizeByAllowedRoles(credential, allowedRoles) {
        try {
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
    async authorizeByForbiddenRoles(credential, forbiddenRoles) {
        try {
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
    async authorizeByUserId(credential, id) {
        if (id !== credential.userId) {
            throw new Error('Unauthorized');
        }
        return Promise.resolve(credential);
    }
}
