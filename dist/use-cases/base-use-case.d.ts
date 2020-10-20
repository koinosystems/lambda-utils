export declare abstract class BaseUseCase<T> {
    abstract buildUseCase(): Promise<T>;
    execute(params?: any): Promise<T>;
}
