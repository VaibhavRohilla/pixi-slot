import { ISlotInfo } from './interfaces';
import { IBaseGame } from './models/games';
import { IGameConfig, IGameInput, IRNG } from './models/gamesAbstractModels';

export abstract class Game<GameState extends IBaseGame = IBaseGame, I = any> {
    gameName = '';

    get State(): GameState {
        return this.GameState;
    }

    set State(state: GameState) {
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
        } else if (!state.totals && !this.GameState) {
            state.totals = {
                spins: 0,
                winAmount: 0,
                winningSpins: 0,
                bets: 0,
            };
        }

        if (!this.GameState) {
            this.GameState = state;
        } else {
            Object.assign(this.GameState, state);
        }
        this.stateCounter++;
    }

    public eventId: string;

    protected GameState: GameState;
    protected stateCounter = 0;
    protected info: ISlotInfo<I>;
    private gameConfig: IGameConfig;
    private rng: IRNG;
    protected cheatTool;

    protected constructor(
        info: ISlotInfo<I>,
        gameConfig: IGameConfig,
        rng: IRNG
    ) {
        this.cheatTool = false;
        this.info = Object.create(info);
        this.gameConfig = gameConfig;
        this.rng = rng;
    }

    get getRng(): IRNG {
        return this.rng;
    }

    get getGameConfig(): IGameConfig {
        return this.gameConfig;
    }

    public abstract async action(gameInput: IGameInput);

    public Start(state: any): GameState {
        this.State = state;
        return this.State;
    }

    protected bet(direction: '+' | '-' | 'max' | 'min' | number): GameState {
        if (
            typeof direction === 'number' &&
            direction <= this.State.bet.max &&
            direction >= this.State.bet.min
        ) {
            this.State.bet.current = direction;
        }
        if (
            direction === '+' &&
            this.State.bet.current + this.State.bet.change <= this.State.bet.max
        ) {
            this.State.bet.current += this.State.bet.change;
        }
        if (
            direction === '-' &&
            this.State.bet.current - this.State.bet.change >= this.State.bet.min
        ) {
            this.State.bet.current -= this.State.bet.change;
        }
        if (direction === 'max') {
            this.State.bet.current = this.State.bet.max;
        }
        if (direction === 'min') {
            this.State.bet.current = this.State.bet.min;
        }
        return this.State;
    }

    protected lines(direction: '+' | '-' | 'max' | 'min' | number): GameState {
        if (
            typeof direction === 'number' &&
            direction <= this.State.bet.lines.max &&
            direction >= this.State.bet.lines.min
        ) {
            this.State.bet.lines.current = direction;
        }
        if (
            direction === '+' &&
            this.State.bet.lines.current + this.State.bet.lines.change <=
                this.State.bet.lines.max
        ) {
            this.State.bet.lines.current += this.State.bet.lines.change;
        }
        if (
            direction === '-' &&
            this.State.bet.lines.current - this.State.bet.lines.change >=
                this.State.bet.lines.min
        ) {
            this.State.bet.lines.current -= this.State.bet.lines.change;
        }
        if (direction === 'max') {
            this.State.bet.lines.current = this.State.bet.lines.max;
        }
        if (direction === 'min') {
            this.State.bet.lines.current = this.State.bet.lines.min;
        }
        return this.State;
    }

    protected abstract async play(): Promise<GameState>;

    protected async playBonus?(): Promise<GameState>;

    protected async playJackpot?(): Promise<GameState>;
}
