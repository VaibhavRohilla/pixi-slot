export interface ISettingsDataPresenter {
    sound: boolean;
    music: boolean;
    leftHanded: boolean;
    spaceForSpin: boolean;
    holdForAuto: boolean;
    holdForAutoDelay: number;
    turboOn: boolean;
    currentPage: string;
    menuTransition: boolean;
}

export interface IBetAndAutospinDataPresenter {
    autoSpinLevels: number[];
    lossLimitLevels: number[];
    singleWinLimitLevels: number[];
    betLevels: number[];
    currentAutospin: number;
    potentialAutospin: number;
    accumulatedLoss: number;
    totalAutospins: number;
    lossLimit: number;
    singleWinLimit: number;
    selectedBet: number;
    stopAfterJackpot: boolean;
    autoSpinInitiated: boolean;
}

export interface IStatusDataPresenter {
    balance: number;
    win: number;
    bet: number;
    lineBet: number;
    currentLines: number;
    freeSpins: IFreeSpinsDataPresenter;
}

export interface IFreeSpinsDataPresenter {
    currentSpin: number;
    totalSpins: number;
    totalWin: number;
    expandingWild: number;
}

export interface IReelsDataPresenter {
    screen: number[][];
    reelsNum: number;
    rowsNum: number;
}

export interface IWinDataPresenter {
    sym: number;
    count: number;
    affectedSymbolBits: number;
    lineIndex: number;
    win: number;
}

export interface IWinDescriptionDataPresenter {
    lineWins: IWinDataPresenter[];
    scatterWins: IWinDataPresenter[];
    triggeredFreeSpins: number;
    endOfFreeSpins: boolean;
    multiplier: number;
    affectedSymbolBits: number;
    expandingWin: IWinDataPresenter;
    triggeredAdditionalBonus: boolean;
    additional: any;
}

export type IWinLinesDataPresenter = number[][];
export type ISymbolsDataPresenter = string[];

export interface IHistoryDataPresenter {
    pageActive: boolean;
    isLoadingHistory: boolean;
    playerId: string;
    gameStatus: string;
    startBalance: number;
    betAmount: number;
    winAmount: number;
    endBalance: number;
    interruptionReason: string;
    interruptionTime: number;
    startTime: number;
    endTime: number;
    current: number;
    total: number;
    historyDepth: number;
    screen: number[][];
    additionalScreen: number[][];
    currrentFreeSpin: number;
    totalFreeSpins: number;
    triggeredFreeSpins: number;
}

export interface ISlotDataPresenter {
    isForcing: boolean;
    reels: IReelsDataPresenter;
    futureReels: IReelsDataPresenter;
    status: IStatusDataPresenter;
    futureStatus: IStatusDataPresenter;
    betAndAutospin: IBetAndAutospinDataPresenter;
    winDescription: IWinDescriptionDataPresenter;
    winLines: IWinLinesDataPresenter;
    symbols: ISymbolsDataPresenter;
    paytable: number[][];
    scattersPaytable: number[][];
    symbolsBonus: ISymbolsDataPresenter;
    settings: ISettingsDataPresenter;
    isRecovery: number;
    historyData: IHistoryDataPresenter;
    freeSpinsBufferIndex: number;
}
