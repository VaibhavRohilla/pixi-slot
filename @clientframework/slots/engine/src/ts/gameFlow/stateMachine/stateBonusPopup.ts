import SlotStateAbstract from './slotStateAbstract';
import { BONUS_POPUP_DURATION } from '@specific/config';

export default class StateBonusPopup extends SlotStateAbstract {
    constructor() {
        super('StateBonusPopup');
    }

    delay = 1500;
    delayEndFS = 1000;
    doBonusEndOnlyIfWin = true;

    protected onEnter(): void {
        if (
            (this.slotData.winDescription &&
                this.slotData.winDescription.triggeredFreeSpins > 0) ||
            (this.slotData.winDescription &&
                this.slotData.winDescription.triggeredAdditionalBonus)
        ) {
            if (this.slotData.futureStatus.win === 0) {
                this.delay = 0;
            }
            this.myStateMachine.eventEntity.time.addEvent({
                delay: this.delay,
                callback: () => {
                    this.eventEmitter.emit('event-animation-win-interrupt');
                    this.eventEmitter.emit(
                        'event-start-popup-bonusPopup',
                        BONUS_POPUP_DURATION,
                        this.slotData.winDescription.multiplier,
                        this.slotData.winDescription.triggeredFreeSpins,
                        this.slotData.status.freeSpins.totalSpins > 0,
                        this.slotData.winDescription.triggeredAdditionalBonus
                    );
                },
                callbackScope: this,
                loop: false,
            });
        } else if (
            (!this.doBonusEndOnlyIfWin ||
                (this.doBonusEndOnlyIfWin &&
                    this.slotData.futureStatus.freeSpins.totalWin > 0)) &&
            this.slotData.winDescription &&
            this.slotData.winDescription.endOfFreeSpins
        ) {
            this.eventEmitter.emit(
                'event-animation-bonusEnd-willStart',
                this.slotData.futureStatus.freeSpins.totalWin
            );
            this.myStateMachine.eventEntity.time.addEvent({
                delay: this.delayEndFS,
                callback: () => {
                    this.eventEmitter.emit('event-animation-win-interrupt');
                    console.log('event-animation-bonusEnd-start');
                    this.eventEmitter.emit(
                        'event-animation-bonusEnd-start',
                        this.slotData.futureStatus.freeSpins.totalWin
                    );
                    this.eventEmitter.emit(
                        'event-update-total-all-wins-data',
                        this.slotData.futureStatus.freeSpins.totalWin
                    );
                },
                callbackScope: this,
                loop: false,
            });
        } else {
            this.endState();
        }
    }

    protected create(): void {
        this.onThisStateEvent(
            'event-stopped-popup-bonusPopup',
            () => {
                this.endState();
            },
            this
        );

        this.onThisStateEvent(
            'event-animation-bonusEnd-ended',
            () => {
                this.endState();
            },
            this
        );
    }

    endState(): void {
        this.myStateMachine.setCurrentState('StateBeforeEnd', this.slotData);
        // let delay = 0;
        // let isAuto = (this.slotData.betAndAutospin.currentAutospin > 0 || this.slotData.status.freeSpins.totalSpins > 0);
        // if (this.slotData.futureStatus.win > 0 && isAuto) {
        //     delay = 1500;
        // }
        // else if(this.slotData.settings.turboOn && isAuto) {
        //     delay = 75;
        // }

        // let timedEvent = this.myStateMachine.eventEntity.time.addEvent({delay: delay, callback: () => {
        //     if(isAuto) {
        //         this.myStateMachine.setCurrentState("StateAskServerBeforeSpin", this.slotData);
        //     } else {
        //         this.myStateMachine.setCurrentState("StateIdle", this.slotData);
        //     }
        // }, callbackScope: this, loop: false});
    }
}
