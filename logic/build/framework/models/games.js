"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMainSLot = exports.IBaseGame = void 0;
var IBaseGame = /** @class */ (function () {
    function IBaseGame() {
    }
    return IBaseGame;
}());
exports.IBaseGame = IBaseGame;
var IMainSLot = /** @class */ (function (_super) {
    __extends(IMainSLot, _super);
    function IMainSLot(init) {
        var _this = _super.call(this) || this;
        Object.assign(_this, init);
        return _this;
    }
    return IMainSLot;
}(IBaseGame));
exports.IMainSLot = IMainSLot;
