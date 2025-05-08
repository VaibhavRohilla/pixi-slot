import SlotStateAbstract from './slotStateAbstract';
import { eUserInputCommands } from '../userInput/userInputCommands';
import { getLanguageTextGameMsg } from '@clientframework/common/backend-service/src/client-remote-data/src/multilanguage/gameMsgData';
import { GameMsgKeys } from '@clientframework/common/backend-service/src/client-remote-data/src/multilanguage/gameMsgKeys';

export default class StateAskServerForHistory extends SlotStateAbstract {
    private waitForData = false;
    private isServerDataArrived = false;
    private historydata = null;
    private historyIndex = 0;

    public refreshFromModelAdditionalPtr: (
        myState: StateAskServerForHistory
    ) => void = null;

    constructor() {
        super('StateAskServerForHistory');
    }

    protected onEnter(): void {
        this.historyIndex = 0;
        this.waitForData = false;
        this.isServerDataArrived = false;
        this.eventEmitter.emit(
            'event-send-to-server-getHistory',
            this.slotData.historyData.historyDepth
        );
        this.slotData.historyData.pageActive = true;
        this.slotData.historyData.isLoadingHistory = true;
        this.eventEmitter.emit('event-close-html-popups');
        this.eventEmitter.emit('event-animation-win-interrupt');
    }

    protected onExit(): void {
        // if (
        //     this.slotData &&
        //     this.slotData.hasOwnProperty('historyTextAddition')
        // ) {
        //     this.slotData.historyTextAddition = '';
        // }
        this.slotData.historyData.pageActive = false;
    }

    protected create(): void {
        // this.onThisStateEvent("preload-complete", () => {
        //     console.log("StateConnecting")
        //     this.myStateMachine.setCurrentState("StateIdle");
        // }, this);

        this.onThisStateEvent(
            'event-recieve-from-server',
            (arg) => this.initDataArrived(arg),
            this
        );
        // this.onThisStateEvent(
        //     'event-current-data-updated',
        //     (data) => this.currentDataArrived(data),
        //     this
        // );

        this.onThisStateEvent(
            'event-error-popup',
            () => {
                this.myStateMachine.setCurrentState(
                    'StateConnecting',
                    this.slotData
                );
            },
            this
        );

        this.onThisStateEvent(
            `event-user-input-${eUserInputCommands.historyPrev}`,
            () => {
                this.historyIndex--;
                if (this.historyIndex < 0 && this.historydata) {
                    this.historyIndex = this.historydata.length - 1;
                }
                this.waitForData = true;
                this.refreshHistoryPresenter();
                // this.eventEmitter.emit(
                //     'event-update-current-data-with-server-data',
                //     this.historydata[this.historyIndex]
                // );
            },
            this
        );

        this.onThisStateEvent(
            `event-user-input-${eUserInputCommands.historyNext}`,
            () => {
                this.historyIndex++;
                if (
                    this.historyIndex >= this.historydata.length &&
                    this.historydata
                ) {
                    this.historyIndex = 0;
                }
                this.waitForData = true;
                this.refreshHistoryPresenter();
                // this.eventEmitter.emit(
                //     'event-update-current-data-with-server-data',
                //     this.historydata[this.historyIndex]
                // );
            },
            this
        );

        this.onThisStateEvent(
            `event-user-input-${eUserInputCommands.historyClose}`,
            () => {
                if (this.isServerDataArrived) {
                    this.myStateMachine.setCurrentState(
                        'StateIdle',
                        this.slotData
                    );
                }
            },
            this
        );
    }

    initDataArrived(input: any): void {
        console.log('HistoryDataArrived', this, input);
        // if (input.hasOwnProperty('isInitMsg') && input.isInitMsg) {
        //     return;
        // }

        // this.waitForData = true;
        // console.log('HistoryDataArrived', this, input);
        // this.eventEmitter.emit(
        //     'event-update-current-data-with-server-data',
        //     input
        // );

        if (
            input &&
            input.game &&
            input.game.states &&
            input.game.states.length > 0
        ) {
            console.log('HistoryDataArrived', this, input);
            const tmpHistData = JSON.parse(JSON.stringify(input.game.states));
            this.historydata = [];
            let lastTrueEndItem = null;
            for (let i = 0; i < Math.min(tmpHistData.length, 50); i++) {
                const item = JSON.parse(JSON.stringify(tmpHistData[i]));
                // if (item.reason) {
                //     continue;
                // }
                const hasAdditInfo =
                    item.additionalInfo &&
                    item.additionalInfo.hasOwnProperty('ended');
                const trueEnded =
                    item.actionType == 'getState' &&
                    (!hasAdditInfo ||
                        (hasAdditInfo && item.additionalInfo.ended));
                if (trueEnded) {
                    lastTrueEndItem = item;
                    lastTrueEndItem.actionType = getLanguageTextGameMsg(
                        GameMsgKeys.historyPlayCompleted
                    );
                } else if (lastTrueEndItem) {
                    const notEnded = hasAdditInfo && !item.additionalInfo.ended;
                    const isInterrupted =
                        item.actionType == 'getState' && notEnded;
                    if (isInterrupted || item.reason) {
                        if (!lastTrueEndItem.reason) {
                            lastTrueEndItem.reason = getLanguageTextGameMsg(GameMsgKeys.historyShutDown);
                        }
                        if (item.reason) {
                            lastTrueEndItem.reason +=  '\n' + item.reason;
                        }
                    }
                    const isPlayed = item.actionType == 'play' && notEnded;
                    if (isPlayed && (this.historydata.length == 0 || this.historydata[this.historydata.length - 1] != lastTrueEndItem)) {
                        this.historydata.push(lastTrueEndItem);
                    }
                }
            }
            this.rearangeHistoryDataFromServer();
            this.isServerDataArrived = true;
            this.slotData.historyData.isLoadingHistory = false;
            this.refreshHistoryPresenter();
        } else {
            setTimeout(() => {
                this.eventEmitter.emit('event-error-popup-force-close');
                this.myStateMachine.setCurrentState('StateIdle', this.slotData);
            }, 1000);
        }
    }

    refreshHistoryPresenter(): void {
        if (this.historydata.length == 0) {
            return;
        }
        const historyItem = JSON.parse(
            JSON.stringify(this.historydata[this.historyIndex])
        );

        this.slotData.historyData.screen = historyItem.screen;
        this.slotData.historyData.additionalScreen = [];
        this.slotData.historyData.gameStatus = historyItem.actionType;
        this.slotData.historyData.endBalance = historyItem.oldBalance;
        this.slotData.historyData.triggeredFreeSpins = historyItem.triggeredFreeSpins
            ? historyItem.triggeredFreeSpins
            : 0;

        this.slotData.historyData.betAmount =
            historyItem.bet.current * historyItem.bet.lines.current;
        this.slotData.historyData.winAmount =
            historyItem.winDescription && historyItem.winDescription.totalWin
                ? historyItem.winDescription.totalWin
                : 0;
        this.slotData.historyData.currrentFreeSpin = historyItem.currrentFreeSpin
            ? historyItem.currrentFreeSpin
            : 0;
        this.slotData.historyData.totalFreeSpins = historyItem.totalFreeSpins
        ? historyItem.totalFreeSpins
        : 0;
        if (this.slotData.historyData.currrentFreeSpin != 0 || this.slotData.historyData.triggeredFreeSpins > 0) {
            if (this.slotData.historyData.currrentFreeSpin == 0) {
                this.slotData.historyData.endBalance -= historyItem.totalFSWin;
                this.slotData.historyData.startBalance = this.slotData.historyData.endBalance - historyItem.mainFSWin + this.slotData.historyData.betAmount;
                this.slotData.historyData.winAmount = historyItem.mainFSWin;
            } else {
                this.slotData.historyData.startBalance = this.slotData.historyData.endBalance - historyItem.totalFSWin;
                if (this.slotData.historyData.currrentFreeSpin < this.slotData.historyData.totalFreeSpins || this.slotData.historyData.triggeredFreeSpins > 0) {
                    this.slotData.historyData.endBalance = this.slotData.historyData.startBalance;
                }
            }
        } else {
            // if (this.slotData.historyData.totalFreeSpins == 0) {
            this.slotData.historyData.startBalance =
                this.slotData.historyData.endBalance +
                this.slotData.historyData.betAmount -
                this.slotData.historyData.winAmount;
            // }
        }

        if (this.slotData.historyData.currrentFreeSpin != 0) {
            this.slotData.historyData.betAmount = 0;
        }

        this.slotData.historyData.interruptionReason = historyItem.reason
            ? historyItem.reason
            : '';
        //this.slotData.historyData.interruptionTime
        this.slotData.historyData.startTime = historyItem.created;
        this.slotData.historyData.endTime = historyItem.created;
        this.slotData.historyData.current = this.historyIndex + 1;
        this.slotData.historyData.total = this.historydata.length;

        if (this.refreshFromModelAdditionalPtr) {
            this.refreshFromModelAdditionalPtr(this);
        }

        this.eventEmitter.emit('event-current-data-updated', this.slotData);
        // this.eventEmitter.emit(
        //     'event-update-current-data-with-server-data',
        //     this.historydata[this.historyIndex]
        // );
    }

    // currentDataArrived(data): void {
    //     if (this.waitForData) {
    //         this.slotData = data;
    //         this.waitForData = false;
    //         this.eventEmitter.emit(
    //             'event-refresh-current-reels',
    //             this.slotData.reels
    //         );
    //         //this.myStateMachine.setCurrentState('StateIdle', data);
    //         // if (this.historydata) {
    //         //     this.slotData.historyTextAddition = ` HISTORY ${
    //         //         this.historyIndex + 1
    //         //     }/${this.historydata.length}`;
    //         // }
    //     }
    // }
    private rearangeHistoryDataFromServer(): void {
        const tmpHistData = [];
        this.historydata.forEach((item_) => {
            tmpHistData.push(JSON.parse(JSON.stringify(item_)));
            const item = tmpHistData[tmpHistData.length - 1];
            if (
                item.hasOwnProperty('winDescription') &&
                item.winDescription.bonusWin &&
                item.winDescription.bonusWin.length > 0
            ) {
                item['triggeredFreeSpins'] =
                    item.winDescription.bonusWin[0].totalSpins;
                let totalFSWin = 0;
                item.winDescription.bonusWin.forEach((bonusWinItem) => {
                    totalFSWin += bonusWinItem.totalWin;
                });
                item['totalFSWin'] = totalFSWin;
                item['mainFSWin'] = item.winDescription.totalWin - totalFSWin;
                item.winDescription.bonusWin.forEach((bonusWinItem) => {
                    tmpHistData.push(JSON.parse(JSON.stringify(item)));
                    const newItem = tmpHistData[tmpHistData.length - 1];
                    newItem.triggeredFreeSpins = 0;
                    newItem.screen = JSON.parse(
                        JSON.stringify(bonusWinItem.screen)
                    );
                    newItem.winDescription = {
                        totalWin: bonusWinItem.totalWin,
                    };
                    newItem['currrentFreeSpin'] = bonusWinItem.spinsCount;
                    newItem['totalFreeSpins'] = bonusWinItem.totalSpins;
                });
            }
        });
        this.historydata = tmpHistData;
    }
}
