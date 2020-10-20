export class BaseUseCase {
    async execute(params) {
        try {
            return await this.buildUseCase();
        }
        catch (err) {
            console.log('||error||', err);
            throw err;
        }
    }
}
