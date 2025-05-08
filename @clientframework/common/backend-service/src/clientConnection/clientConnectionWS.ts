import { getConnectionUrl } from './getConnectionURL';
import { ErrorMsgKeys } from '../client-remote-data/src/multilanguage/errorMsgKeys';
import { noErrorsFromRGS } from '../errorsHandling/rgsErrorChecker';
import { getEventEmitter } from '../eventEmitter';
import ClientConnectionAbstract from './clientConnectionAbstract';

import * as Index from '@clientframework/common/backend-service/src/client-remote-data/src/scripts/index';
import { hasRecovery } from '../launchParams/hasRecovery';
import { doReconnect } from '../launchParams/doReconnect';
Index;

export default class ClientConnectionWS extends ClientConnectionAbstract {
    private cli: WebSocket;

    private initialized = false;
    private triesCnt = 0;
    private shouldUpdateSessionId = true;
    private hasError = false;
    private firstTimeConnected = false;

    constructor(private usingTrueRGS: boolean) {
        super();

        this.startConnectionChecking();

        this.connect();
    }

    protected connect(): void {
        if (this.firstTimeConnected && !doReconnect()) {
            return;
        }
        this.firstTimeConnected = true;

        this.cli = new WebSocket(getConnectionUrl(this.usingTrueRGS));

        this.cli.onopen = (): void => {
            this.shouldUpdateSessionId = true;
            console.log('connection onopen');

            this.cli.onmessage = (m): void => {
                const data = JSON.parse(m.data.toString());

                const path = data.path;
                let input = data.input;
                const error = data.error;

                this.hasError = false;
                if (error) {
                    this.hasError = true;
                    getEventEmitter().emit(
                        'event-error-popup',
                        ErrorMsgKeys.connectionError
                    );
                }

                console.log('connection onmessage', JSON.parse(m.data));

                if (input && input.error) {
                    this.hasError = true;
                    noErrorsFromRGS(input);
                }

                if (this.usingTrueRGS) {
                    if (path === 'authenticate') {
                        if (input && input.hasOwnProperty('playerId')) {
                            getEventEmitter().emit(
                                'event-history-set-playerId',
                                input.playerId
                            );
                        }
                        setTimeout(() => {
                            if (hasRecovery()) {
                                getEventEmitter().emit(
                                    'event-send-to-server-getState'
                                );
                            } else {
                                getEventEmitter().emit(
                                    'event-send-to-server-init'
                                );
                            }
                            setTimeout(() => {
                                if (!this.initialized) {
                                    //delcons console.log("reconnect, authenticate")
                                    this.reconnect();
                                }
                            }, 10000);
                        }, 1000);
                        return;
                    }
                }

                if (path === 'init' || (hasRecovery() && !this.initialized)) {
                    console.log('usao u init');
                    if (
                        this.shouldUpdateSessionId &&
                        input.hasOwnProperty('game') &&
                        input.game.hasOwnProperty('gameSessionId') &&
                        input.game.gameSessionId
                    ) {
                        this.shouldUpdateSessionId = false;
                        getEventEmitter().emit(
                            'event-update-gameSessionId',
                            input.game.gameSessionId
                        );
                    } else if (input.hasOwnProperty('error')) {
                        if (hasRecovery() && path !== 'init') {
                            getEventEmitter().emit('event-send-to-server-init');
                            return;
                        }
                        noErrorsFromRGS(input);
                        return;
                    }
                    this.initialized = true;
                    input.isInitMsg = true;
                    this.triesCnt = 0;
                    this.hasError = false;
                    console.log(input);
                }

                if (!this.hasError && noErrorsFromRGS(input)) {
                    this.recieveFromServer(input);
                }

            };
        };

        this.cli.onclose = (): void => {
            //delcons console.log("reconnect, closed connection")
            this.reconnect();
        };
    }

    protected sendToServer(msg: any): void {
        if (this.cli.readyState !== this.cli.OPEN) {
            //delcons console.log("Send, not yet opened")
            setTimeout(() => this.sendToServer(msg), 500);
        } else {
            console.log('sending...', msg);
            this.cli.send(JSON.stringify(msg));
        }
    }

    // redefinition
    protected setEventListeners(): void {
        super.setEventListeners();
        getEventEmitter().on('event-online-again', this.reconnect, this);
    }

    /////////////////////////////////

    private startConnectionChecking(): void {
        getEventEmitter().emit('event-start-checking-connection');
    }

    private reconnect(wasConnectionCheckError = false): void {
        //delcons console.log("triggeredReconnect")
        if (this.triesCnt >= 5 && !this.hasError) {
            if (!wasConnectionCheckError) {
                getEventEmitter().emit(
                    'event-error-popup',
                    ErrorMsgKeys.connectionError
                );
            }
        }
        this.triesCnt++;
        this.initialized = false;
        this.connect();
    }

    // sendState(state: any) {
    //     this.sendToServer(this.clientInputPort.getInputObject<{ gameInput: any }>(LogicFormats.ePathCommands.play, { gameInput: state.state }));
    // }
}
