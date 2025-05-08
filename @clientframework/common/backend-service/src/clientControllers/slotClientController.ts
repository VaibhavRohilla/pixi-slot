import LogicFormats from '../logicFormats';
import { getEventEmitter } from '../eventEmitter';
import { CURRENCY } from '@specific/dataConfig';
import { hasRecovery } from '../launchParams/hasRecovery';

export default class SlotClientController extends LogicFormats.ClientInputPort {
    constructor(usingTrueRGS: boolean) {
        super(usingTrueRGS);
        this.trueRGSInputData.currency = `${CURRENCY}`;

        getEventEmitter().on('event-send-to-server-bet', this.sendBet, this);
        getEventEmitter().on(
            'event-send-to-server-play',
            (isForcing, balance) => {
                this.sendPlay(isForcing, balance);
            },
            this
        );
        getEventEmitter().on('event-send-to-server-init', this.sendInit, this);
        getEventEmitter().on(
            'event-send-to-server-getState',
            this.sendGetState,
            this
        );
        getEventEmitter().on(
            'event-send-to-server-ended',
            this.sendEnded,
            this
        );
        getEventEmitter().on(
            'event-update-gameSessionId',
            (gameSessionId) =>
                (this.trueRGSInputData.gameSessionId = gameSessionId)
        );
        getEventEmitter().on(
            'event-recieve-from-server',
            this.solveIncomingState,
            this
        );
        getEventEmitter().on(
            'event-send-to-server-getHistory',
            this.sendGetHistory,
            this
        );
    }

    private sendBet(amount: number): void {
        getEventEmitter().emit(
            'event-send-to-server',
            this.getBetInputObject(amount)
        );
    }

    private sendPlay(isForcing, balance): void {
        const sendingObj = this.getPlayInputObject(isForcing);
        if (hasRecovery()) {
            Object.assign(sendingObj.input, {
                additionalInfo: {
                    ended: false,
                    balance: balance,
                },
            });
        }
        getEventEmitter().emit('event-send-to-server', sendingObj);
    }

    private sendGetState(): void {
        console.log('sendng... getState');
        getEventEmitter().emit('event-send-to-server', {
            path: 'action',
            input: {
                gameInput: {
                    actionType: 'getState',
                    actionInput: {},
                },
            },
        });
    }

    private sendEnded(value = true): void {
        if (!hasRecovery()) {
            return;
        }
        getEventEmitter().emit('event-send-to-server', {
            path: 'action',
            input: {
                gameInput: {
                    actionType: 'getState',
                    actionInput: {},
                },
                additionalInfo: {
                    ended: value,
                },
                gameSessionId: this.trueRGSInputData.gameSessionId,
            },
        });
    }

    private sendGetHistory(depth = 5): void {
        getEventEmitter().emit('event-send-to-server', {
            path: 'action',
            input: {
                gameInput: {
                    actionType: 'getHistory',
                    actionInput: {
                        depth,
                    },
                },
                gameSessionId: this.trueRGSInputData.gameSessionId,
            },
        });
    }

    private sendInit(): void {
        getEventEmitter().emit(
            'event-send-to-server',
            this.getInitInputObject()
        );
    }

    solveIncomingState(input: LogicFormats.iOutputStateAccountResolved): void {
        console.log('solveIncomingState, recieved...', input);
    }
}
