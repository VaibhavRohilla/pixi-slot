export class Factory<T> {
    constructor(private testType: new (...args: any[]) => T) {}

    createInstance(...args: any[]): T {
        return new this.testType(...args);
    }
}
