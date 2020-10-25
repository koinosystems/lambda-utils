import { ResponseError } from '../presentation/response.error';
export class AuthorizerUtils {
    async authorizeByAllowedRoles(credential, allowedRoles) {
        try {
            for (const allowedRole of allowedRoles) {
                if (credential.role === allowedRole) {
                    return;
                }
            }
            throw new ResponseError('Unauthorized', 401);
        }
        catch (err) {
            throw new ResponseError(err.message, err.code ? err.code : err.name ? parseInt(err.name) : 500);
        }
    }
    async authorizeByForbiddenRoles(credential, forbiddenRoles) {
        try {
            for (const forbiddenRole of forbiddenRoles) {
                if (credential.role === forbiddenRole) {
                    throw new ResponseError('Unauthorized', 401);
                }
            }
        }
        catch (err) {
            throw new ResponseError(err.message, err.code ? err.code : err.name ? parseInt(err.name) : 500);
        }
    }
    async authorizeByUserId(credential, id) {
        if (id !== credential.userId) {
            throw new ResponseError('Unauthorized', 401);
        }
    }
}
