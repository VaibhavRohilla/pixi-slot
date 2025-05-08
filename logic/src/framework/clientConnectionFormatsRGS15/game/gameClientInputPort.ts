export interface ITrueRGSInputAttributes {
    currency: string;
    gameSessionId: string;
}

export interface IGameInputFormat<ePaths, InputAttributes = object> {
    path: ePaths;
    input: InputAttributes;
}

export class GameClientInputPort<ePaths> {
    constructor(protected usingTrueRGSData: boolean) {}

    trueRGSInputData: ITrueRGSInputAttributes = {
        gameSessionId: '',
        currency: '',
    };

    getInputObject<InputAttributes = object>(
        command: ePaths,
        input: InputAttributes
    ): IGameInputFormat<ePaths, InputAttributes> {
        const returnMsg: IGameInputFormat<ePaths, InputAttributes> = {
            path: command,
            input,
        };
        if (this.usingTrueRGSData) {
            Object.assign(returnMsg.input, this.trueRGSInputData);
        }

        console.log('crating input obj', returnMsg);

        return returnMsg;
    }
}
