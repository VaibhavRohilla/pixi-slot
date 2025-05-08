import { eUserInputCommands } from '../userInput/userInputCommands';
import SlotStateAbstract from './slotStateAbstract';
import {
    CLOSE_BET_POPUP_ON_BET_CHANGE,
    COMPLEX_AUTO_SPIN,
} from '@specific/config';

export default class StateIdle extends SlotStateAbstract {
    constructor() {
        super('StateIdle');
    }

    private areScenesLoaded = false;

    protected onEnter(): void {
        if (this.slotData.betAndAutospin.currentAutospin > 0) {
            this.eventEmitter.emit(
                `event-user-input-${eUserInputCommands.spinPressed}`
            );
        }
    }

    protected onExit(): void {
        if (this.newKey != 'StateAskServerForHistory') {
            if (
                CLOSE_BET_POPUP_ON_BET_CHANGE ||
                this.newKey != 'StateAskServerForBet'
            ) {
                this.eventEmitter.emit('event-close-popups');
            }
            this.eventEmitter.emit(
                `event-user-input-${eUserInputCommands.closeMenu}`
            );
        }
    }

    protected create(): void {
        this.onThisStateEvent(
            `event-user-input-${eUserInputCommands.spinPressed}`,
            (arg, isForcing: boolean) => {
                if (
                    !(
                        arg == Phaser.Input.Keyboard.KeyCodes.SPACE &&
                        !this.slotData.settings.spaceForSpin
                    ) &&
                    !this.slotData.settings.menuTransition
                ) {
                    console.log('forcee', isForcing);
                    this.slotData.isForcing = isForcing ? isForcing : false;
                    if (this.areScenesLoaded) {
                        this.myStateMachine.setCurrentState(
                            'StateAskServerBeforeSpin',
                            this.slotData
                        );
                    }
                }
            },
            this
        );

        this.onThisStateEvent(
            `event-user-input-${eUserInputCommands.betPopup}`,
            (arg) => {
                this.slotData.betAndAutospin.autoSpinInitiated = arg;
                this.eventEmitter.emit('event-open-bet-popup');
            },
            this
        );

        this.onThisStateEvent(
            `event-user-input-${eUserInputCommands.betRequest}`,
            (value) => {
                if (value > 0) {
                    console.log('state idle, slotData,', this.slotData);
                    this.myStateMachine.setCurrentState(
                        'StateAskServerForBet',
                        value / this.slotData.status.currentLines
                    );
                    if (this.slotData.betAndAutospin.autoSpinInitiated) {
                        this.eventEmitter.emit('event-open-spins-popup');
                        this.slotData.betAndAutospin.autoSpinInitiated = false;
                    }
                }
            },
            this
        );

        this.onThisStateEvent(
            `event-user-input-${eUserInputCommands.historyRequest}`,
            () => {
                console.log('state idle, slotData,', this.slotData);
                setTimeout(() => {
                    this.slotData;
                    this.myStateMachine.setCurrentState(
                        'StateAskServerForHistory',
                        this.slotData
                    );
                }, 5);
            },
            this
        );

        this.onThisStateEvent(
            `event-user-input-${eUserInputCommands.numberOfSpinsSpinPopup}`,
            () => {
                this.eventEmitter.emit('event-open-spins-popup');
            },
            this
        );

        this.onThisStateEvent(
            `event-user-input-${eUserInputCommands.autoSpinSetNumberOfSpins}`,
            (x) => {
                this.slotData.betAndAutospin.potentialAutospin = x;
                this.slotData.betAndAutospin.accumulatedLoss = 0;
                //this.eventEmitter.emit("event-terminate-popups");
                //this.eventEmitter.emit("event-open-loss-limit-popup");
                if (this.slotData.betAndAutospin.potentialAutospin > 0) {
                    console.log(
                        'this.slotData.betAndAutospin.potentialAutospin',
                        this.slotData.betAndAutospin.potentialAutospin
                    );
                    if (COMPLEX_AUTO_SPIN) {
                        this.eventEmitter.emit('event-open-loss-limit-popup');
                    } else {
                        this.slotData.betAndAutospin.totalAutospins = this.slotData.betAndAutospin.currentAutospin = this.slotData.betAndAutospin.potentialAutospin;
                        this.slotData.betAndAutospin.lossLimit = -1;
                        this.slotData.betAndAutospin.stopAfterJackpot = false;
                        this.slotData.betAndAutospin.singleWinLimit = -1;
                        this.eventEmitter.emit(
                            `event-user-input-${eUserInputCommands.spinPressed}`
                        );
                        this.eventEmitter.emit('event-autospin-start');
                    }
                }
            },
            this
        );

        this.onThisStateEvent(
            `event-user-input-${eUserInputCommands.autoSpinSetLossLimit}`,
            (x) => {
                this.slotData.betAndAutospin.lossLimit = x;
                this.eventEmitter.emit('event-terminate-popups');
                const alternativeName = false;
                this.eventEmitter.emit(
                    'event-open-single-win-limit-popup',
                    alternativeName
                );
            },
            this
        );

        // uncomment this for autospin stop after jackpot funcionality

        // this.onThisStateEvent(
        //     `event-user-input-${eUserInputCommands.autoSpinSetSingleWinLimit}`,
        //     (x) => {
        //         this.slotData.betAndAutospin.singleWinLimit = x;
        //         this.eventEmitter.emit('event-terminate-popups');
        //         const alternativeName = false;
        //         this.eventEmitter.emit(
        //             'event-open-stop-after-jackpot-popup',
        //             alternativeName
        //         );
        //     },
        //     this
        // );

        // this.onThisStateEvent(
        //     `event-user-input-${eUserInputCommands.confirmStopAfterJackpot}`,
        //     () => {
        //         const alternativeName = true;
        //         this.eventEmitter.emit('event-open-bet-popup', alternativeName);
        //     },
        //     this
        // );

        // comment out this part this event for autospin stop after jackpot funcionality

        this.onThisStateEvent(
            `event-user-input-${eUserInputCommands.autoSpinSetSingleWinLimit}`,
            (x) => {
                this.slotData.betAndAutospin.totalAutospins = this.slotData.betAndAutospin.currentAutospin = this.slotData.betAndAutospin.potentialAutospin;
                this.slotData.betAndAutospin.singleWinLimit = x;
                this.eventEmitter.emit('event-terminate-popups');
                this.eventEmitter.emit(
                    `event-user-input-${eUserInputCommands.spinPressed}`
                );
                // const alternativeName = true;
                // this.eventEmitter.emit('event-open-bet-popup', alternativeName);
            },
            this
        );

        this.onThisStateEvent(
            'event-popup-closed',
            (isCanceled: boolean) => {
                console.log('event-popup-closed SSS', isCanceled);
                if (isCanceled) {
                    console.log('event-popup-closed AAA');
                    this.slotData.betAndAutospin.currentAutospin = 0;
                }
            },
            this
        );

        this.onThisStateEvent(
            `event-user-input-${eUserInputCommands.showMenu}`,
            () => {
                this.eventEmitter.emit('event-show-menu');
            },
            this
        );

        this.onThisStateEvent(
            'event-scenes-loaded',
            () => {
                setTimeout(() => {
                    this.areScenesLoaded = true;
                }, 250);
            },
            this
        );

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
            'event-init-button-events',
            () => {
                if (this.slotData.isRecovery) {
                    this.myStateMachine.setCurrentState(
                        'StateAskServerBeforeSpin',
                        this.slotData
                    );
                }
            },
            this
        );
    }
}
