import {
    IRNG,
    TRandomInt,
    TRandomFloat,
    TRandomIntArr,
    TRandomFloatArr,
    TShuffle,
} from '../../../models/gamesAbstractModels';

export default class DUMMYRNG implements Partial<IRNG> {
    constructor(public forceValue = -1) {
        //dummy
    }

    public uid(): string {
        return 'uid()';
    }

    public getRandomInt: TRandomInt = async (input) => {
        return new Promise((res, rej) => {
            try {
                if (this.forceValue != -1) {
                    res(this.forceValue);
                }
                res(
                    Math.floor(
                        input.min + (1 + input.max - input.min) * Math.random()
                    )
                );
            } catch (e) {
                rej(e);
            }
        });
    };

    public getRandomFloat: TRandomFloat = async (input) => {
        input;
        return new Promise((res, rej) => {
            try {
                res(0);
            } catch (e) {
                rej(e);
            }
        });
    };

    public getRandomIntArr: TRandomIntArr = async (input) => {
        input;
        return new Promise((res, rej) => {
            try {
                res(0);
            } catch (e) {
                rej(e);
            }
        });
    };

    public getRandomFloatArr: TRandomFloatArr = (input) => {
        input;
        return new Promise((res, rej) => {
            try {
                res(0);
            } catch (e) {
                rej(e);
            }
        });
    };

    public shuffle: TShuffle = (input) => {
        input;
        return new Promise((res, rej) => {
            try {
                res(0);
            } catch (e) {
                rej(e);
            }
        });
    };
}
