export interface IRNG {
    getRandomInt: TRandomInt;

    getRandomFloat: TRandomFloat;

    getRandomIntArr: TRandomIntArr;

    getRandomFloatArr: TRandomFloatArr;

    shuffle: TShuffle;
}

export type TRandomInt = (input: {
    min: number;
    max: number;
}) => Promise<number>;

export type TRandomFloat = (input: {
    min: number;
    max: number;
}) => Promise<number>;

export type TRandomIntArr = (input: {
    min: number;
    max: number;
    size: number;
    sets: number;
}) => Promise<number>;

export type TRandomFloatArr = (input: {
    min: number;
    max: number;
    size: number;
    sets: number;
}) => Promise<number>;

export type TShuffle = (input: any[]) => Promise<any>;

export interface IGameInput {
    actionType: string;
    actionInput?: any;
}
export interface IGameConfigRNG {
    rngType: string;
}
//TODO
export type IGameConfig = IGameConfigRNG | any;
