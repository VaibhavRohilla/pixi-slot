import LogicFormats from '@backendService/logicFormats';
import {
    ISlotDataPresenter,
    IReelsDataPresenter,
    IStatusDataPresenter,
    IWinDataPresenter,
} from './interfaces';

let lastServerData: LogicFormats.iOutputStateAccountResolved = null;

function updateReelsFromServer(
    targetReels: IReelsDataPresenter,
    screen: number[][]
): void {
    targetReels.screen = JSON.parse(JSON.stringify(screen));
    targetReels.reelsNum = targetReels.screen[0].length;
    targetReels.rowsNum = targetReels.screen.length;
}

function updateStatusFromServer(
    targetStatus: IStatusDataPresenter,
    inputSource: LogicFormats.iOutputStateAccountResolved,
    targetData?: ISlotDataPresenter
): void {
    if (
        inputSource.game.hasOwnProperty('additionalInfo') &&
        inputSource.game['additionalInfo'].hasOwnProperty('ended') &&
        inputSource.game['additionalInfo'].hasOwnProperty('balance') &&
        inputSource.game['additionalInfo'].ended == false &&
        targetData &&
        targetStatus == targetData.status &&
        targetData.isRecovery
    ) {
        targetStatus.balance = inputSource.game['additionalInfo']['balance'];
    } else {
        targetStatus.balance = inputSource.account.balance;
    }

    targetStatus.lineBet = inputSource.game.bet.current;
    targetStatus.currentLines = inputSource.game.bet.lines.current;
    targetStatus.bet = targetStatus.lineBet * targetStatus.currentLines;
    if (inputSource.game.hasOwnProperty('win')) {
        if (!targetData || !(targetStatus == targetData.status)) {
            targetStatus.win = inputSource.game.win;
            if (
                inputSource.game.hasOwnProperty('winDescription') &&
                inputSource.game.winDescription.bonusWin &&
                inputSource.game.winDescription.bonusWin.length > 0
            ) {
                let sumFreeSpins = 0;
                inputSource.game.winDescription.bonusWin.forEach((element) => {
                    sumFreeSpins += element.totalWin;
                });

                targetStatus.win -= sumFreeSpins;
                targetStatus.balance -= sumFreeSpins;

                const bonusWin = inputSource.game.winDescription.bonusWin;
                targetStatus.freeSpins.currentSpin = bonusWin[0].spinsCount;
                targetStatus.freeSpins.totalSpins = bonusWin[0].totalSpins;
                targetStatus.freeSpins.expandingWild = bonusWin[0].hasOwnProperty(
                    'expandingSymbolWin'
                )
                    ? bonusWin[0]['expandingSymbolWin'].symbol
                    : 0;
                targetStatus.freeSpins.totalWin = 0;
            }
        }
    } else {
        targetStatus.win = 0;
    }
}

function updateWinDescriptionFromServer(
    targetData: ISlotDataPresenter,
    winDescription: LogicFormats.IWinDescription
): void {
    targetData.winDescription.additional = {
        /*goldenChamber:[//test
            {symbolCount: 1, symbol:4},
            {symbolCount: 5, symbol:6},
            {symbolCount: 6, symbol:5},
            {symbolCount: 1, symbol:7},
        ]*/
    };
    targetData.winDescription.multiplier = 1;
    targetData.winDescription.triggeredFreeSpins = 0;
    targetData.winDescription.endOfFreeSpins = false;
    targetData.winDescription.affectedSymbolBits = 0;
    targetData.winDescription.triggeredAdditionalBonus = false;
    targetData.winDescription.expandingWin = null;

    if (winDescription) {
        if (
            winDescription.hasOwnProperty('additional') &&
            winDescription.additional.hasOwnProperty('multiplier')
        ) {
            targetData.winDescription.multiplier =
                winDescription.additional.multiplier;
        }

        targetData.winDescription.lineWins = [];
        if (winDescription.lineWins && winDescription.lineWins.length > 0) {
            winDescription.lineWins.forEach((lineWin) => {
                const lWin: IWinDataPresenter = {
                    sym: lineWin.symbol,
                    count: lineWin.symbolCount,
                    affectedSymbolBits: lineWin.affectedSymbolsBits,
                    lineIndex: lineWin.lineIndex,
                    win: lineWin.totalWin,
                };
                targetData.winDescription.lineWins.push(lWin);
                targetData.winDescription.affectedSymbolBits |=
                    lWin.affectedSymbolBits;
            });
        }

        targetData.winDescription.scatterWins = [];
        if (winDescription.scatterWin && winDescription.scatterWin.length > 0) {
            winDescription.scatterWin.forEach((scatterWin) => {
                if (scatterWin.affectedSymbolsBits > 0) {
                    const sWin: IWinDataPresenter = {
                        sym: scatterWin.symbol,
                        count: scatterWin.symbolCount,
                        affectedSymbolBits: scatterWin.affectedSymbolsBits,
                        lineIndex: -1,
                        win: scatterWin.totalWin,
                    };
                    targetData.winDescription.scatterWins.push(sWin);
                    targetData.winDescription.affectedSymbolBits |=
                        sWin.affectedSymbolBits;
                }
            });
        }

        if (winDescription.bonusWin && winDescription.bonusWin.length > 0) {
            targetData.winDescription.triggeredFreeSpins =
                winDescription.bonusWin[0].totalSpins;
        }
    }
}

function updateWinLinesSymbolsEtcFromServer(
    targetData: ISlotDataPresenter,
    inputSource: LogicFormats.iOutputStateAccountResolved
): void {
    if (inputSource.game.hasOwnProperty('winLines')) {
        targetData.winLines = JSON.parse(
            JSON.stringify(inputSource.game['winLines'])
        );
    }

    if (inputSource.game.hasOwnProperty('symbols')) {
        targetData.symbols = JSON.parse(
            JSON.stringify(inputSource.game['symbols'])
        );
    }

    if (inputSource.game.hasOwnProperty('symbolsBonus')) {
        targetData.symbolsBonus = JSON.parse(
            JSON.stringify(inputSource.game['symbolsBonus'])
        );
    }

    if (inputSource.game.hasOwnProperty('paytable')) {
        targetData.paytable = JSON.parse(
            JSON.stringify(inputSource.game['paytable'])
        );
    }

    if (inputSource.game.hasOwnProperty('scattersPaytable')) {
        targetData.scattersPaytable = JSON.parse(
            JSON.stringify(inputSource.game['scattersPaytable'])
        );
    }
}

export function updateFutureDataWithServerData(
    targetData: ISlotDataPresenter,
    inputSource: LogicFormats.iOutputStateAccountResolved
): void {
    updateReelsFromServer(targetData.futureReels, inputSource.game.screen);

    updateStatusFromServer(targetData.futureStatus, inputSource);

    targetData.status.lineBet = inputSource.game.bet.current;
    targetData.status.currentLines = inputSource.game.bet.lines.current;

    updateWinDescriptionFromServer(targetData, inputSource.game.winDescription);

    updateWinLinesSymbolsEtcFromServer(targetData, inputSource);

    lastServerData = JSON.parse(JSON.stringify(inputSource));

    console.log('updateFutureDataWithServerData', targetData, lastServerData);
}

export function updateFutureDataWithBufferData(
    targetData: ISlotDataPresenter,
    inputSource: LogicFormats.iOutputStateAccountResolved
): void {
    // let currentSpin = Math.abs(targetData.status.freeSpins.currentSpin);

    // const bonusWin = inputSource.game.winDescription.bonusWin[currentSpin++];

    //const currentSpin = targetData.status.freeSpins.currentSpin;

    const bonusWin =
        inputSource.game.winDescription.bonusWin[
            targetData.freeSpinsBufferIndex
        ];

    updateReelsFromServer(targetData.futureReels, bonusWin.screen);

    targetData.futureStatus.win = bonusWin.totalWin;
    targetData.futureStatus.freeSpins.totalWin += targetData.futureStatus.win;

    const winDescription: LogicFormats.IWinDescription = {
        lineWins: bonusWin.lineWins,
        scatterWin: bonusWin.scatterWin,
        totalWin: bonusWin.totalWin,
        additional: {
            multiplier: targetData.winDescription.multiplier,
        },
    };

    updateWinDescriptionFromServer(targetData, winDescription);

    targetData.futureStatus.freeSpins.currentSpin = 0;
    targetData.futureStatus.freeSpins.totalSpins = 0;
    targetData.winDescription.endOfFreeSpins = false;

    if (bonusWin.hasOwnProperty('expandingSymbolWin')) {
        const expWin: IWinDataPresenter = {
            sym: bonusWin['expandingSymbolWin'].symbol,
            count: bonusWin['expandingSymbolWin'].symbolCount,
            affectedSymbolBits:
                bonusWin['expandingSymbolWin'].affectedSymbolsBits,
            lineIndex: -1,
            win: bonusWin['expandingSymbolWin'].totalWin,
        };

        targetData.winDescription.expandingWin = expWin;
    }

    if (bonusWin.additional && bonusWin.additional.goldenChamber) {
        targetData.winDescription.additional = {
            goldenChamber: bonusWin.additional.goldenChamber,
        };
    }

    if (
        targetData.freeSpinsBufferIndex + 1 <
        inputSource.game.winDescription.bonusWin.length
    ) {
        const bonusWinNext =
            inputSource.game.winDescription.bonusWin[
                targetData.freeSpinsBufferIndex + 1
            ];

        console.log(bonusWinNext);

        targetData.futureStatus.freeSpins.currentSpin = bonusWinNext.spinsCount;
        targetData.futureStatus.freeSpins.totalSpins = bonusWinNext.totalSpins;

        if (bonusWinNext.totalSpins > bonusWin.totalSpins) {
            targetData.winDescription.triggeredFreeSpins =
                bonusWinNext.totalSpins - bonusWin.totalSpins;
        }

        targetData.winDescription.triggeredAdditionalBonus = bonusWin.hasOwnProperty(
            'triggeredBonus'
        )
            ? bonusWin['triggeredBonus']
            : false;
    } else {
        targetData.futureStatus.balance = inputSource.account.balance;
        targetData.winDescription.endOfFreeSpins = true;
        console.log('balanceee = ', inputSource.account.balance, inputSource);
    }

    updateWinLinesSymbolsEtcFromServer(targetData, inputSource);
    targetData.freeSpinsBufferIndex++;

    lastServerData = JSON.parse(JSON.stringify(inputSource));

    console.log('updateFutureDataWithBufferData', targetData, lastServerData);
}

export function updateDataPresenterWithServerData(
    targetData: ISlotDataPresenter,
    inputSource: LogicFormats.iOutputStateAccountResolved,
    eventEmitter: Phaser.Events.EventEmitter
): void {
    if (!inputSource.hasOwnProperty('game')) {
        inputSource = {
            //@ts-ignore
            game: inputSource,
            //@ts-ignore
            account: {
                balance: targetData.status.balance,
            },
        };
    }

    console.log('updateDataPresenterWithServerData', inputSource);
    if (targetData.isRecovery) {
        targetData.isRecovery = 0;
        if (
            inputSource.game.hasOwnProperty('additionalInfo') &&
            inputSource.game['additionalInfo'].hasOwnProperty('ended') &&
            inputSource.game['additionalInfo'].ended == false
        ) {
            targetData.isRecovery = 1;
            if (
                inputSource.game.win == 0 &&
                inputSource.game.winDescription &&
                inputSource.game.winDescription.totalWin > 0
            ) {
                inputSource.game.win = inputSource.game.winDescription.totalWin;
                inputSource.game.isWin = true;
            }
            eventEmitter.emit('event-update-last-server-data', inputSource);
        }
    }

    updateReelsFromServer(targetData.reels, inputSource.game.screen);

    updateStatusFromServer(targetData.status, inputSource, targetData);

    updateWinDescriptionFromServer(targetData, inputSource.game.winDescription);

    updateWinLinesSymbolsEtcFromServer(targetData, inputSource);

    lastServerData = JSON.parse(JSON.stringify(inputSource));

    console.log(
        'updateDataPresenterWithServerData',
        targetData,
        lastServerData
    );
}
