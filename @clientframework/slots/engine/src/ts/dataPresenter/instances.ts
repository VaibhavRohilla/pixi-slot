import {
    IStatusDataPresenter,
    IReelsDataPresenter,
    IFreeSpinsDataPresenter,
    ISlotDataPresenter,
    IBetAndAutospinDataPresenter,
} from './interfaces';
import { betLimitsConfig } from '@specific/dataConfig';
import { HAS_RECOVERY } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/defaultConfig';
import { getUrlDenomination } from '@clientframework/common/backend-service/src/launchParams/denomination';

export const currentFreeSpinsData: IFreeSpinsDataPresenter = {
    currentSpin: 0,
    totalSpins: 0,
    totalWin: 0,
    // placeholder TODO
    expandingWild: 0,
};

export const currentStatusData: IStatusDataPresenter = {
    balance: 0,
    win: 0,
    bet: 0,
    lineBet: 0,
    currentLines: 0,
    freeSpins: currentFreeSpinsData,
};

export const futureStatusData: IStatusDataPresenter = JSON.parse(
    JSON.stringify(currentStatusData)
);

export const currentReelsData: IReelsDataPresenter = {
    screen: [],
    reelsNum: 0,
    rowsNum: 0,
};

export const futureReelsData: IReelsDataPresenter = JSON.parse(
    JSON.stringify(currentReelsData)
);

export const betAndAutospinData: IBetAndAutospinDataPresenter = {
    betLevels: JSON.parse(JSON.stringify(betLimitsConfig.betLevels)),
    lossLimitLevels: JSON.parse(
        JSON.stringify(betLimitsConfig.lossLimitLevels)
    ),
    singleWinLimitLevels: JSON.parse(
        JSON.stringify(betLimitsConfig.singleWinLimitLevels)
    ),
    autoSpinLevels: JSON.parse(JSON.stringify(betLimitsConfig.autoSpinLevels)),
    currentAutospin: 0,
    potentialAutospin: 0,
    totalAutospins: 0,
    lossLimit: 0,
    singleWinLimit: 0,
    selectedBet: 0,
    accumulatedLoss: 0,
    stopAfterJackpot: false,
    autoSpinInitiated: false,
};
betAndAutospinData.betLevels = betAndAutospinData.betLevels.map(
    (e) => e / getUrlDenomination()
);
betAndAutospinData.lossLimitLevels = betAndAutospinData.lossLimitLevels.map(
    (e) => e / getUrlDenomination()
);
betAndAutospinData.singleWinLimitLevels = betAndAutospinData.singleWinLimitLevels.map(
    (e) => e / getUrlDenomination()
);
betAndAutospinData.autoSpinLevels = betAndAutospinData.autoSpinLevels.map(
    (e) => e / getUrlDenomination()
);

export const slotDataPresenter: ISlotDataPresenter = {
    isForcing: false,
    reels: currentReelsData,
    futureReels: futureReelsData,
    status: currentStatusData,
    futureStatus: futureStatusData,
    betAndAutospin: betAndAutospinData,
    winDescription: {
        lineWins: [],
        scatterWins: [],
        triggeredFreeSpins: 0,
        endOfFreeSpins: false,
        multiplier: 1,
        affectedSymbolBits: 0,
        expandingWin: null,
        triggeredAdditionalBonus: false,
        additional: {},
    },
    winLines: [],
    paytable: [],
    scattersPaytable: [],
    symbols: [],
    symbolsBonus: [],
    settings: {
        sound: true,
        music: true,
        spaceForSpin: true,
        leftHanded: false,
        holdForAuto: false,
        holdForAutoDelay: 1000,
        turboOn: false,
        currentPage: '',
        menuTransition: false,
    },
    isRecovery: HAS_RECOVERY ? 1 : 0,
    historyData: {
        pageActive: false,
        isLoadingHistory: false,
        playerId: '',
        gameStatus: '',
        startBalance: 0,
        betAmount: 0,
        winAmount: 0,
        endBalance: 0,
        interruptionReason: '',
        interruptionTime: 0,
        startTime: 0,
        endTime: 0,
        current: 0,
        total: 0,
        historyDepth: 200,
        screen: [],
        additionalScreen: [],
        currrentFreeSpin: 0,
        totalFreeSpins: 0,
        triggeredFreeSpins: 0,
    },
    freeSpinsBufferIndex: 0,
};

export function isSymbolOnScreen(
    reels: IReelsDataPresenter,
    symbolIndex: number,
    targetingReel = -1
): boolean {
    // expanding wilds
    for (let reelIndex = 0; reelIndex < reels.reelsNum; reelIndex++) {
        for (let rowIndex = 0; rowIndex < reels.rowsNum; rowIndex++) {
            const sym = reels.screen[rowIndex][reelIndex];
            if (
                symbolIndex === sym &&
                (targetingReel < 0 || targetingReel == reelIndex)
            ) {
                return true;
            }
        }
    }
    return false;
}
