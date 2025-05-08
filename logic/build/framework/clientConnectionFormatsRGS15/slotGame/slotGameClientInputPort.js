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
var slotGameCommands_1 = require("./slotGameCommands");
var gameClientInputPort_1 = require("../game/gameClientInputPort");
var SlotGameClientInputPort = /** @class */ (function (_super) {
    __extends(SlotGameClientInputPort, _super);
    function SlotGameClientInputPort(usingRGSData) {
        return _super.call(this, usingRGSData) || this;
    }
    SlotGameClientInputPort.prototype.getBetInputObject = function (betValue) {
        console.log('creating bet input');
        return _super.prototype.getInputObject.call(this, slotGameCommands_1.ePathSlotCommands.action, {
            gameInput: {
                actionType: slotGameCommands_1.ePathSlotCommands.bet,
                actionInput: {
                    direction: betValue,
                },
            },
        });
    };
    SlotGameClientInputPort.prototype.getPlayInputObject = function (isForcing) {
        console.log('creating play input', isForcing);
        var input = {
            gameInput: {
                actionType: slotGameCommands_1.ePathSlotCommands.play,
            },
        };
        if (isForcing !== undefined) {
            Object.assign(input.gameInput, {
                actionInput: {
                    force: isForcing,
                },
            });
        }
        return _super.prototype.getInputObject.call(this, slotGameCommands_1.ePathSlotCommands.action, input);
    };
    SlotGameClientInputPort.prototype.getInitInputObject = function () {
        console.log('creating init input');
        return _super.prototype.getInputObject.call(this, slotGameCommands_1.ePathSlotCommands.init, {});
    };
    return SlotGameClientInputPort;
}(gameClientInputPort_1.GameClientInputPort));
exports.default = SlotGameClientInputPort;
