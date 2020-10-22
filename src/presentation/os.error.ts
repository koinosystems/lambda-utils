export class OSError extends Error {
  constructor(message: string, code: number) {
    super();
    this.message = message;
    this.name = `${code}`;
  }
}
