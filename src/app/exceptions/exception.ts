export class Exception {
  constructor(private message: string) {
  }
  toString(): string {
    return this.message;
  }
}
