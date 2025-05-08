"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var ws = __importStar(require("ws"));
var index_1 = __importDefault(require("../../../criticalFiles/index"));
var fake_wallet_1 = __importDefault(require("../fake-wallet"));
var dummyRNG_1 = __importDefault(require("../rngExamples/dummyRNG"));
//const WebSocket = require('ws');
var port = Number(process.env.PORT) || 9090;
// let httpsServer = https.createServer({
//    cert: fs.readFileSync(__dirname + '/testServer.cert'),
//    key: fs.readFileSync(__dirname + '/testServer.key')
// }).listen(port);
var server = new ws.Server({ port: port }); // {server: httpsServer});//{server: httpsServer});
console.log("wss server created :" + port);
server.on('connection', function (socket) {
    console.log("Client Connected " + new Date(Date.now()));
    var gameConfig = {
        rngType: 'GamingIsaac',
    };
    var game = new index_1.default(gameConfig, new dummyRNG_1.default());
    var fakeWallet = new fake_wallet_1.default();
    var account = fakeWallet;
    var initialOutput = { game: game.State, account: account, resolved: true };
    initialOutput.game.win = 0;
    delete initialOutput.game.winDescription;
    var initialMsg = JSON.stringify(Object.assign({ input: initialOutput }, { path: 'init' }));
    socket.send(initialMsg);
    function sendMessage(message) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, path, input, meta, account_1, output, msg;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = JSON.parse(message.toString()), path = _a.path, input = _a.input, meta = _a.meta;
                        if (!path) {
                            socket.send('ERROR NO PATH');
                            socket.close();
                        }
                        if (!(path === 'action' &&
                            input &&
                            input.hasOwnProperty('gameInput') &&
                            input.gameInput.hasOwnProperty('actionType') &&
                            (input.gameInput.actionType === 'play' ||
                                input.gameInput.actionType === 'bet'))) return [3 /*break*/, 2];
                        return [4 /*yield*/, game.action(input.gameInput)];
                    case 1:
                        _b.sent();
                        account_1 = fakeWallet.change((game.State.hasOwnProperty('winDescription')
                            ? game.State.winDescription.totalWin
                            : 0) -
                            game.State.bet.current * game.State.bet.lines.current);
                        output = { game: game.State, account: account_1, resolved: true };
                        msg = JSON.stringify(Object.assign({ input: output }, { meta: meta }, { path: path }));
                        console.log('sending play', msg);
                        socket.send(msg);
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    }
    socket.on('message', function (message) {
        sendMessage(message)
            .then(function () {
            console.log('message sent dummy');
        })
            .catch(function (err) { return console.log(err); });
    });
    socket.on('close', function () {
        console.log("Client Disconnected " + Date.now());
    });
});
