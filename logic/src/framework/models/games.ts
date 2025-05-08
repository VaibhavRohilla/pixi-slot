import { IBet } from './bet';
import { IBonusWin } from './bonusWin';
import { IWinData } from './winData';
import { IWinDescription } from './winDescription';

export class IBaseGame {
    public bet?: IBet;
    public win?: number;
    public winDescription?: IWinDescription;
    public scatterWinDescription?: IWinData;
    public bonusWinDescription?: IBonusWin;
    public totals?: {
        spins: number;
        bets: number;
        winAmount: number;
        winningSpins: number;
    };

    public states?: any[];
}
export interface IMainSlot extends IBaseGame {
    screen?: number[][];
    affectedSymbolsBits?: number;
    isWin: boolean;
    winDescription?: IWinDescription;
    scatterWinDescription?: IWinData;
    bonusWinDescription?: IBonusWin;
}
export class IMainSLot extends IBaseGame implements IMainSlot {
    public screen?: number[][];
    public affectedSymbolsBits?: number;
    public isWin: boolean;
    public winDescription: IWinDescription;
    public scatterWinDescription?: IWinData;
    public bonusWinDescription?: IBonusWin;
    constructor(init: IMainSLot) {
        super();
        Object.assign(this, init);
    }
}
