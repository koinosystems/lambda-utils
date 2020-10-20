export abstract class BaseUseCase<T> {
  abstract buildUseCase(): Promise<T>;

  public async execute(params?: any): Promise<T> {
    try {
      return await this.buildUseCase();
    } catch (err) {
      console.log('||error||', err);
      throw err;
    }
  }
}
