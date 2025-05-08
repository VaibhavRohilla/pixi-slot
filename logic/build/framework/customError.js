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
var CustomError = /** @class */ (function (_super) {
    __extends(CustomError, _super);
    function CustomError(message, status, privateMessage, fatal, revert) {
        if (fatal === void 0) { fatal = false; }
        if (revert === void 0) { revert = false; }
        var _this = _super.call(this, message) || this;
        _this.message = message;
        _this.status = status;
        _this.privateMessage = privateMessage;
        _this.revert = revert;
        /* tslint:disable */
        _this.toJSON = function () {
            var obj = {};
            Object.getOwnPropertyNames(_this).forEach(function (key) {
                obj[key] = this[key];
            }, _this);
            return obj;
        };
        fatal;
        _this.status = status || 400;
        _this.privateMessage = _this.privateMessage || _this.message;
        _this.customError = true;
        _this.module = 'FlamingSpins';
        _this.name = _this.module + "Error";
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return CustomError;
}(Error));
exports.default = CustomError;
