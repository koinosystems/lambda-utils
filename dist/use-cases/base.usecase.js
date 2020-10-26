export class BaseUseCase {
    async execute() {
        try {
            return await this.buildUseCase();
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    }
}
