"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var Game = /** @class */ (function () {
    function Game(info, gameConfig, rng) {
        this.gameName = '';
        this.stateCounter = 0;
        this.cheatTool = false;
        this.info = Object.create(info);
        this.gameConfig = gameConfig;
        this.rng = rng;
    }
    Object.defineProperty(Game.prototype, "State", {
        get: function () {
            return this.GameState;
        },
        set: function (state) {
            if (!state.totals && this.GameState) {
                state.totals = this.GameState.totals || {
                    spins: 0,
                    winAmount: 0,
                    winningSpins: 0,
                    bets: 0,
                };
                state.totals.spins++;
                state.totals.winningSpins +=
                    state.winDescription && state.winDescription.totalWin > 0
                        ? 1
                        : 0;
                state.totals.winAmount += state.winDescription
                    ? state.winDescription.totalWin
                    : 0;
                state.totals.bets +=
                    state.bet && state.bet.current && state.bet.lines.current
                        ? state.bet.current * state.bet.lines.current
                        : this.GameState.bet &&
                            this.GameState.bet.current &&
                            this.GameState.bet.lines
                            ? this.GameState.bet.current *
                                this.GameState.bet.lines.current
                            : 0;
            }
            else if (!state.totals && !this.GameState) {
                state.totals = {
                    spins: 0,
                    winAmount: 0,
                    winningSpins: 0,
                    bets: 0,
                };
            }
            if (!this.GameState) {
                this.GameState = state;
            }
            else {
                Object.assign(this.GameState, state);
            }
            this.stateCounter++;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "getRng", {
        get: function () {
            return this.rng;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "getGameConfig", {
        get: function () {
            return this.gameConfig;
        },
        enumerable: false,
        configurable: true
    });
    Game.prototype.Start = function (state) {
        this.State = state;
        return this.State;
    };
    Game.prototype.bet = function (direction) {
        if (typeof direction === 'number' &&
            direction <= this.State.bet.max &&
            direction >= this.State.bet.min) {
            this.State.bet.current = direction;
        }
        if (direction === '+' &&
            this.State.bet.current + this.State.bet.change <= this.State.bet.max) {
            this.State.bet.current += this.State.bet.change;
        }
        if (direction === '-' &&
            this.State.bet.current - this.State.bet.change >= this.State.bet.min) {
            this.State.bet.current -= this.State.bet.change;
        }
        if (direction === 'max') {
            this.State.bet.current = this.State.bet.max;
        }
        if (direction === 'min') {
            this.State.bet.current = this.State.bet.min;
        }
        return this.State;
    };
    Game.prototype.lines = function (direction) {
        if (typeof direction === 'number' &&
            direction <= this.State.bet.lines.max &&
            direction >= this.State.bet.lines.min) {
            this.State.bet.lines.current = direction;
        }
        if (direction === '+' &&
            this.State.bet.lines.current + this.State.bet.lines.change <=
                this.State.bet.lines.max) {
            this.State.bet.lines.current += this.State.bet.lines.change;
        }
        if (direction === '-' &&
            this.State.bet.lines.current - this.State.bet.lines.change >=
                this.State.bet.lines.min) {
            this.State.bet.lines.current -= this.State.bet.lines.change;
        }
        if (direction === 'max') {
            this.State.bet.lines.current = this.State.bet.lines.max;
        }
        if (direction === 'min') {
            this.State.bet.lines.current = this.State.bet.lines.min;
        }
        return this.State;
    };
    return Game;
}());
exports.Game = Game;
