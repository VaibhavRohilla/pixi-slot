"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameClientInputPort = void 0;
var GameClientInputPort = /** @class */ (function () {
    function GameClientInputPort(usingTrueRGSData) {
        this.usingTrueRGSData = usingTrueRGSData;
        this.trueRGSInputData = {
            gameSessionId: '',
            currency: '',
        };
    }
    GameClientInputPort.prototype.getInputObject = function (command, input) {
        var returnMsg = {
            path: command,
            input: input,
        };
        if (this.usingTrueRGSData) {
            Object.assign(returnMsg.input, this.trueRGSInputData);
        }
        console.log('crating input obj', returnMsg);
        return returnMsg;
    };
    return GameClientInputPort;
}());
exports.GameClientInputPort = GameClientInputPort;
