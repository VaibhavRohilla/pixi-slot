export default class Wallet {
    balance: number;
    user = 'demos';
    constructor() {
        this.balance = 2000;
    }

    get State(): {
        balance: number;
        user: string;
    } {
        const { balance, user } = this;
        return { balance, user };
    }

    change(
        amm: number
    ): {
        balance: number;
        user: string;
    } {
        if (this.balance + amm >= 0) {
            this.balance += amm;
        }
        return this.State;
    }
}
