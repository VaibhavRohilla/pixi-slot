export default class CustomError extends Error {
    public customError: boolean;
    public module: string;
    public name: string;
    constructor(
        public message: string,
        public status: number,
        public privateMessage?: string,
        fatal = false,
        public revert: boolean = false
    ) {
        super(message);
        fatal;
        this.status = status || 400;
        this.privateMessage = this.privateMessage || this.message;
        this.customError = true;
        this.module = 'FlamingSpins';
        this.name = `${this.module}Error`;
        Error.captureStackTrace(this, this.constructor);
    }

    /* tslint:disable */
    toJSON = (): any => {
        const obj = {};
        Object.getOwnPropertyNames(this).forEach(function (key) {
            obj[key] = this[key];
        }, this);
        return obj;
    };
    /* tslint:enable */
}
