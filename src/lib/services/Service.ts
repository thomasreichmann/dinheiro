export abstract class Service {
    private readonly _base: string;

    protected constructor(base: string) {
        this._base = base;
    }

    get baseURL() {
        return new URL(this._base, window.location.origin);
    }

    private static instance: Service;

    protected abstract createInstance(): Service;

    static getInstance(): Service {
        if (!this.instance) {
            this.instance = this.prototype.createInstance();
        }
        return this.instance;
    }
}
