"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientInputPort = exports.ePathCommands = void 0;
var slotGameCommands_1 = require("./slotGame/slotGameCommands");
Object.defineProperty(exports, "ePathCommands", { enumerable: true, get: function () { return slotGameCommands_1.ePathSlotCommands; } });
var slotGameClientInputPort_1 = __importDefault(require("./slotGame/slotGameClientInputPort"));
exports.ClientInputPort = slotGameClientInputPort_1.default;
//export enum ePathCommands;
