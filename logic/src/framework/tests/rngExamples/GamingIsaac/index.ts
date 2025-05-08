import { ChildProcess, fork } from 'child_process';
import { EventEmitter } from 'events';
import {
    IRNG,
    TRandomFloat,
    TRandomFloatArr,
    TRandomInt,
    TRandomIntArr,
    TShuffle,
} from '../../../models/gamesAbstractModels';

export default class ISAAC implements Partial<IRNG> {
    private child: ChildProcess;
    private emitter: EventEmitter;

    constructor() {
        const devOrTest =
            process.env.NODE_ENV === 'development' ||
            process.env.NODE_ENV === 'test';
        this.child = fork(
            devOrTest ? `${__dirname}/rng.ts` : `${__dirname}/rng.js`
        );

        this.emitter = new EventEmitter();

        this.child.on('message', (msg) => {
            const { eventId, rsp } = JSON.parse(msg);
            this.emitter.emit(eventId, rsp);
        });
    }

    public uid(): string {
        let d = new Date().getTime();

        return 'xxxxxxxx-xxxx'.replace(/[xy]/g, (c) => {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);

            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });
    }

    public getRandomInt: TRandomInt = async (input) => {
        return new Promise((res, rej) => {
            try {
                if (!this.child) {
                    rej(new Error('process not forked'));
                }
                const eventId = this.uid();
                this.emitter.addListener(eventId, (output) => {
                    res(output);
                    this.emitter.removeAllListeners(eventId);
                });
                this.child.send(
                    JSON.stringify({ path: 'randomint', input, eventId })
                );
            } catch (e) {
                rej(e);
            }
        });
    };

    public getRandomFloat: TRandomFloat = async (input) => {
        return new Promise((res, rej) => {
            try {
                if (!this.child) {
                    rej(new Error('process not forked'));
                }
                const eventId = this.uid();
                this.emitter.addListener(eventId, (output) => {
                    res(output);
                    this.emitter.removeAllListeners(eventId);
                });
                this.child.send(
                    JSON.stringify({ path: 'randomfloat', input, eventId })
                );
            } catch (e) {
                rej(e);
            }
        });
    };

    public getRandomIntArr: TRandomIntArr = async (input) => {
        return new Promise((res, rej) => {
            try {
                if (!this.child) {
                    rej(new Error('process not forked'));
                }
                const eventId = this.uid();
                this.emitter.addListener(eventId, (output) => {
                    res(output);
                    this.emitter.removeAllListeners(eventId);
                });
                this.child.send(
                    JSON.stringify({ path: 'randomintarr', input, eventId })
                );
            } catch (e) {
                rej(e);
            }
        });
    };

    public getRandomFloatArr: TRandomFloatArr = (input) => {
        return new Promise((res, rej) => {
            try {
                if (!this.child) {
                    rej(new Error('process not forked'));
                }
                const eventId = this.uid();
                this.emitter.addListener(eventId, (output) => {
                    res(output);
                    this.emitter.removeAllListeners(eventId);
                });
                this.child.send(
                    JSON.stringify({ path: 'randomfloatarr', input, eventId })
                );
            } catch (e) {
                rej(e);
            }
        });
    };

    public shuffle: TShuffle = (input) => {
        return new Promise((res, rej) => {
            try {
                if (!this.child) {
                    rej(new Error('process not forked'));
                }
                const eventId = this.uid();
                this.emitter.addListener(eventId, (output) => {
                    res(output);
                    this.emitter.removeAllListeners(eventId);
                });
                this.child.send(
                    JSON.stringify({ path: 'shuffle', input, eventId })
                );
            } catch (e) {
                rej(e);
            }
        });
    };
}
