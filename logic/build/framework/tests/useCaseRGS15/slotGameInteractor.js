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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bet = exports.play = exports.createGameLogicAndWallet = void 0;
var index_1 = __importDefault(require("../../../criticalFiles/index"));
var slotGameOutputFormats_1 = require("../../clientConnectionFormatsRGS15/slotGame/slotGameOutputFormats");
var inOutFormats_1 = require("../../clientConnectionFormatsRGS15/inOutFormats");
var fake_wallet_1 = __importDefault(require("../fake-wallet"));
function createGameLogicAndWallet(rng, skipWallet) {
    if (skipWallet === void 0) { skipWallet = false; }
    var gameConfig = {
        rngType: 'GamingIsaac',
    };
    var specificGame = new index_1.default(gameConfig, rng);
    var wallet = skipWallet ? null : new fake_wallet_1.default();
    return {
        specificGame: specificGame,
        wallet: wallet,
        initialMsg: slotGameOutputFormats_1.createSlotGameOutputObject(specificGame.State, wallet, inOutFormats_1.ePathCommands.init, true),
    };
}
exports.createGameLogicAndWallet = createGameLogicAndWallet;
function play(game, fakeWallet, meta, actionInput) {
    if (meta === void 0) { meta = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var gameInput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // case - not enough balance
                    if (fakeWallet.balance <
                        game.State.bet.current * game.State.bet.lines.current) {
                        return [2 /*return*/, slotGameOutputFormats_1.createSlotGameOutputObject(game.State, fakeWallet, inOutFormats_1.ePathCommands.play, false, meta)];
                    }
                    gameInput = actionInput
                        ? { actionType: inOutFormats_1.ePathCommands.play, actionInput: actionInput }
                        : { actionType: inOutFormats_1.ePathCommands.play };
                    return [4 /*yield*/, game.action(gameInput)];
                case 1:
                    _a.sent();
                    fakeWallet.change(slotGameOutputFormats_1.getTotalWin(game.State) - slotGameOutputFormats_1.getTotalBet(game.State));
                    return [2 /*return*/, slotGameOutputFormats_1.createSlotGameOutputObject(game.State, fakeWallet, inOutFormats_1.ePathCommands.play, false, meta)];
            }
        });
    });
}
exports.play = play;
function bet(game, value, fakeWallet, meta) {
    if (meta === void 0) { meta = {}; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, game.action({
                        actionType: inOutFormats_1.ePathCommands.bet,
                        actionInput: {
                            direction: value,
                        },
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, slotGameOutputFormats_1.createSlotGameOutputObject(game.State, fakeWallet, inOutFormats_1.ePathCommands.bet, true, meta)];
            }
        });
    });
}
exports.bet = bet;
