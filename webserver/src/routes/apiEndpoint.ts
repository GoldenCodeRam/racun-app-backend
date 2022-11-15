export abstract class ApiEndpoint {
  constructor(public readonly name: string) { }

  public getUrl(): string {
    return `/api/${this.name}`;
  }

  public getUrlWithExtension(extension: string): string {
    return `${this.getUrl()}/${extension}`;
  }

  public abstract registerMethods(app: any): void;
}
