import { IWinData } from './winData';

export interface IWinDescription {
    totalWin: number;
    lineWins?: IWinData[];
    scatterWin?: IWinData[];
    bonusWin?: IBonus[];
    additional?: any;
}

export interface IBonus {
    screen: number[][];
    totalWin: number;
    lineWins: IWinData[];
    scatterWin?: IWinData[];
    totalSpins?: number;
    spinsCount?: number;
    additional?: any;
}
