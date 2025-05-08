"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var events_1 = require("events");
var ISAAC = /** @class */ (function () {
    function ISAAC() {
        var _this = this;
        this.getRandomInt = function (input) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        try {
                            if (!_this.child) {
                                rej(new Error('process not forked'));
                            }
                            var eventId_1 = _this.uid();
                            _this.emitter.addListener(eventId_1, function (output) {
                                res(output);
                                _this.emitter.removeAllListeners(eventId_1);
                            });
                            _this.child.send(JSON.stringify({ path: 'randomint', input: input, eventId: eventId_1 }));
                        }
                        catch (e) {
                            rej(e);
                        }
                    })];
            });
        }); };
        this.getRandomFloat = function (input) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        try {
                            if (!_this.child) {
                                rej(new Error('process not forked'));
                            }
                            var eventId_2 = _this.uid();
                            _this.emitter.addListener(eventId_2, function (output) {
                                res(output);
                                _this.emitter.removeAllListeners(eventId_2);
                            });
                            _this.child.send(JSON.stringify({ path: 'randomfloat', input: input, eventId: eventId_2 }));
                        }
                        catch (e) {
                            rej(e);
                        }
                    })];
            });
        }); };
        this.getRandomIntArr = function (input) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        try {
                            if (!_this.child) {
                                rej(new Error('process not forked'));
                            }
                            var eventId_3 = _this.uid();
                            _this.emitter.addListener(eventId_3, function (output) {
                                res(output);
                                _this.emitter.removeAllListeners(eventId_3);
                            });
                            _this.child.send(JSON.stringify({ path: 'randomintarr', input: input, eventId: eventId_3 }));
                        }
                        catch (e) {
                            rej(e);
                        }
                    })];
            });
        }); };
        this.getRandomFloatArr = function (input) {
            return new Promise(function (res, rej) {
                try {
                    if (!_this.child) {
                        rej(new Error('process not forked'));
                    }
                    var eventId_4 = _this.uid();
                    _this.emitter.addListener(eventId_4, function (output) {
                        res(output);
                        _this.emitter.removeAllListeners(eventId_4);
                    });
                    _this.child.send(JSON.stringify({ path: 'randomfloatarr', input: input, eventId: eventId_4 }));
                }
                catch (e) {
                    rej(e);
                }
            });
        };
        this.shuffle = function (input) {
            return new Promise(function (res, rej) {
                try {
                    if (!_this.child) {
                        rej(new Error('process not forked'));
                    }
                    var eventId_5 = _this.uid();
                    _this.emitter.addListener(eventId_5, function (output) {
                        res(output);
                        _this.emitter.removeAllListeners(eventId_5);
                    });
                    _this.child.send(JSON.stringify({ path: 'shuffle', input: input, eventId: eventId_5 }));
                }
                catch (e) {
                    rej(e);
                }
            });
        };
        var devOrTest = process.env.NODE_ENV === 'development' ||
            process.env.NODE_ENV === 'test';
        this.child = child_process_1.fork(devOrTest ? __dirname + "/rng.ts" : __dirname + "/rng.js");
        this.emitter = new events_1.EventEmitter();
        this.child.on('message', function (msg) {
            var _a = JSON.parse(msg), eventId = _a.eventId, rsp = _a.rsp;
            _this.emitter.emit(eventId, rsp);
        });
    }
    ISAAC.prototype.uid = function () {
        var d = new Date().getTime();
        return 'xxxxxxxx-xxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });
    };
    return ISAAC;
}());
exports.default = ISAAC;
