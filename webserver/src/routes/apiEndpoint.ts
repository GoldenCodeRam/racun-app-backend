export abstract class ApiEndpoint {
    constructor(public readonly name: string) {}

    public getUrl(): string {
        return `/api/${this.name}`;
    }

    public getUrlWithExtension(extension: string): string {
        return `${this.getUrl()}/${extension}`;
    }

    public registerMethods(app: any) {
        this.searchElements(app);

        // GET, POST, PUT Methods.
        this.getElementById(app);
        this.createElement(app);
        this.updateElement(app);

        this.registerCustomMethods(app);
    }

    public abstract searchElements(app: any): void;

    public abstract getElementById(app: any): void;

    public abstract createElement(app: any): void;

    public abstract updateElement(app: any): void;

    public abstract registerCustomMethods(app: any): void;
}
