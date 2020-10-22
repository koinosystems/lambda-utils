export abstract class BaseUseCase<T> {
  abstract buildUseCase(): Promise<T>;

  public async execute(): Promise<T> {
    try {
      return await this.buildUseCase();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
