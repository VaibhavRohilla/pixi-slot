import SlotStateAbstract from './slotStateAbstract';
import { IS_OFFLINE, IS_USING_TRUE_RGS } from '@specific/dataConfig';
import { GameMsgKeys } from '@clientframework/common/backend-service/src/client-remote-data/src/multilanguage/gameMsgKeys';
import { COMPLEX_AUTO_SPIN } from '@specific/config';

export default class StateAskServerBeforeSpin extends SlotStateAbstract {
    private waitForPresenterData = false;
    private lastServerData = null;
    recoveryPerformed = false;
    closableErrorPopupActive = false;

    constructor() {
        super('StateAskServerBeforeSpin');
    }

    protected onEnter(): void {
        console.log('StateAskServerBeforeSpin', this.slotData);

        this.waitForPresenterData = false;

        if (this.slotData.isRecovery && !this.recoveryPerformed) {
            this.recoveryPerformed = true;
            this.serverDataArrived(this.lastServerData);
        } else if (this.slotData.status.freeSpins.totalSpins > 0) {
            this.waitForPresenterData = true;
            this.eventEmitter.emit(
                'event-update-future-data-with-buffer-data',
                this.lastServerData
            );
        } else {
            this.slotData.freeSpinsBufferIndex = 0;
            if (this.slotData.betAndAutospin.currentAutospin > 0) {
                if (COMPLEX_AUTO_SPIN) {
                    if (
                        (this.slotData.betAndAutospin.currentAutospin <
                            this.slotData.betAndAutospin.totalAutospins &&
                            this.slotData.betAndAutospin.singleWinLimit > -1 &&
                            this.slotData.status.win >=
                            this.slotData.betAndAutospin.singleWinLimit) ||
                        (this.slotData.betAndAutospin.lossLimit > -1 &&
                            this.slotData.betAndAutospin.accumulatedLoss +
                            this.slotData.status.bet >
                            this.slotData.betAndAutospin.lossLimit)
                    ) {
                        this.slotData.betAndAutospin.currentAutospin = 0;
                        this.eventEmitter.emit('event-autospin-stop');
                        this.eventEmitter.emit(
                            'event-current-data-updated',
                            this.slotData
                        );

                        this.myStateMachine.setCurrentState(
                            'StateIdle',
                            this.slotData
                        );

                        return;
                    }
                }
                this.slotData.betAndAutospin.currentAutospin--;
            }

            if (IS_OFFLINE || (!IS_OFFLINE && !IS_USING_TRUE_RGS)) {
                if (this.slotData.status.balance < this.slotData.status.bet) {
                    this.slotData.betAndAutospin.currentAutospin = 0;
                    this.myStateMachine.setCurrentState(
                        'StateIdle',
                        this.slotData
                    );
                    this.eventEmitter.emit(
                        'event-error-popup',
                        GameMsgKeys.notEnoughBalance,
                        true
                    );
                    return;
                }
            }
            this.eventEmitter.emit(
                'event-send-to-server-play',
                this.slotData.isForcing,
                this.slotData.status.balance
            );
        }
    }

    protected create(): void {
        // TODO - this.spinDataArrived, this) was not working
        this.onThisStateEvent(
            'event-recieve-from-server',
            (arg) => this.serverDataArrived(arg),
            this
        );
        this.onThisStateEvent(
            'event-future-data-updated',
            (data) => this.presenterDataArrived(data),
            this
        );

        this.onThisStateEvent(
            'event-error-popup',
            (key, isResponsible = false, code = -1) => {
                key;
                code;
                if (isResponsible) {
                    this.myStateMachine.setCurrentState(
                        'StateIdle',
                        this.slotData
                    );
                } else {
                    this.myStateMachine.setCurrentState(
                        'StateConnecting',
                        this.slotData
                    );
                }
            },
            this
        );

        this.onThisStateEvent(
            'event-error-popup-supplier',
            (msg: string, supplier: string, action: any, buttons: any) => {
                if (this.slotData.status.balance < this.slotData.status.bet) {
                    this.slotData.betAndAutospin.currentAutospin = 0;
                }
                if (supplier == 'sgt' && msg.includes('timeout')) {
                    this.closableErrorPopupActive = true;
                } else {                    
                    this.myStateMachine.setCurrentState('StateIdle', this.slotData);
                }
            },
            this
        );

        this.eventEmitter.on(
            'event-update-last-server-data',
            this.updateLastServerData,
            this
        );
    }

    updateLastServerData(input: any): void {
        this.lastServerData = JSON.parse(JSON.stringify(input));
    }

    serverDataArrived(input: any): void {
        this.updateLastServerData(input);
        this.waitForPresenterData = true;
        console.log('spinDataArrived', this, this.lastServerData);
        this.eventEmitter.emit(
            'event-update-future-data-with-server-data',
            this.lastServerData
        );
    }

    presenterDataArrived(data): void {
        if (this.waitForPresenterData) {
            if (this.closableErrorPopupActive) {
                this.closableErrorPopupActive = false;
                this.eventEmitter.emit('event-error-popup-force-continue');
            }
            this.slotData = data;
            this.waitForPresenterData = false;
            if (this.slotData.status.freeSpins.totalSpins == 0) {
                this.eventEmitter.emit('event-take-bet', data);
            }
            this.myStateMachine.setCurrentState('StatePresentSpinning', data);
        }
    }
}
