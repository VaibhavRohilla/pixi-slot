import SlotStateAbstract from './slotStateAbstract';
import { HAS_RECOVERY } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/defaultConfig';

export default class StateBeforeEnd extends SlotStateAbstract {
    constructor() {
        super('StateBeforeEnd');
    }

    protected onEnter(): void {
        this.slotData.isRecovery = 0;
        this.eventEmitter.emit(
            'event-update-current-data-with-future-data',
            this.slotData
        );
    }

    protected create(): void {
        this.onThisStateEvent(
            'event-current-data-updated-with-future-data',
            () => {
                if (this.slotData.betAndAutospin.currentAutospin > 0) {
                    this.slotData.betAndAutospin.accumulatedLoss +=
                        this.slotData.status.bet - this.slotData.status.win;
                    console.log(
                        'LOOOOOSSSSSSS',
                        this.slotData.betAndAutospin.accumulatedLoss,
                        this.slotData.status.bet,
                        this.slotData.betAndAutospin.lossLimit,
                        this.slotData.status.win
                    );
                    // if (this.slotData.winDescription && this.slotData.winDescription.triggeredFreeSpins > 0
                    //     || this.slotData.betAndAutospin.lossLimit != -1 && this.slotData.betAndAutospin.accumulatedLoss + this.slotData.status.bet >= this.slotData.betAndAutospin.lossLimit
                    // ) {
                    // this.slotData.betAndAutospin.currentAutospin = 0;
                    // }
                }

                //this.myStateMachine.setCurrentState("StateBonusPopup", this.slotData);

                const isAuto = (): boolean =>
                    this.slotData.betAndAutospin.currentAutospin > 0 ||
                    this.slotData.status.freeSpins.totalSpins > 0;

                let delay = 0;
                if (
                    this.slotData.winDescription.triggeredFreeSpins > 0 ||
                    (this.slotData.futureStatus.win > 0 && isAuto())
                ) {
                    delay = 1500;
                } else if (this.slotData.settings.turboOn && isAuto()) {
                    delay = 75;
                }

                // if (this.slotData.status.freeSpins.totalSpins > 0 && this.slotData.status.freeSpins.currentSpin === 1) {
                //     delay = 0;
                // }

                console.log('ISPALAA 1', this.myStateMachine.currentState.key);

                this.myStateMachine.eventEntity.time.addEvent({
                    delay: delay,
                    callback: () => {
                        if (isAuto()) {
                            console.log(
                                'ISPALAA 2',
                                this.myStateMachine.currentState.key
                            );
                            this.myStateMachine.setCurrentState(
                                'StateAskServerBeforeSpin',
                                this.slotData
                            );
                        } else {
                            if (HAS_RECOVERY) {
                                this.eventEmitter.emit(
                                    'event-send-to-server-ended'
                                );
                            } else {
                                this.myStateMachine.setCurrentState(
                                    'StateIdle',
                                    this.slotData
                                );
                            }
                        }
                    },
                    callbackScope: this,
                    loop: false,
                });
            },
            this
        );

        this.onThisStateEvent(
            'event-recieve-from-server',
            (arg) => this.serverDataArrived(arg),
            this
        );
    }

    serverDataArrived(input: any): void {
        input;
        this.myStateMachine.setCurrentState('StateIdle', this.slotData);
    }
}
