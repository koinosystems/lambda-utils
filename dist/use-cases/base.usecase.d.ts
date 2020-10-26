export declare abstract class BaseUseCase<T> {
    abstract buildUseCase(): Promise<T>;
    execute(): Promise<T>;
}
