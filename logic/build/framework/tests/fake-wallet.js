"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Wallet = /** @class */ (function () {
    function Wallet() {
        this.user = 'demos';
        this.balance = 2000;
    }
    Object.defineProperty(Wallet.prototype, "State", {
        get: function () {
            var _a = this, balance = _a.balance, user = _a.user;
            return { balance: balance, user: user };
        },
        enumerable: false,
        configurable: true
    });
    Wallet.prototype.change = function (amm) {
        if (this.balance + amm >= 0) {
            this.balance += amm;
        }
        return this.State;
    };
    return Wallet;
}());
exports.default = Wallet;
