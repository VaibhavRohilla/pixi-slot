export interface IGameOutputFormatStateAccount<IGameStateFormat, tWallet> {
    game: IGameStateFormat;
    account: tWallet;
    resolved: boolean;
    error?: any;
}

export interface IGameOutputFormatFull<IGameStateFormat, ePaths, tWallet> {
    input: IGameOutputFormatStateAccount<IGameStateFormat, tWallet>;
    path: ePaths;
}

export function createGameOutputObjectMsg<IGameStateFormat, ePaths, tWallet>(
    gameState: IGameStateFormat,
    account: tWallet,
    pathCommandName: ePaths,
    shouldRemoveWinDescription = false,
    meta: any = {}
): IGameOutputFormatFull<IGameStateFormat, ePaths, tWallet> {
    const initialOutput = { game: gameState, account, resolved: true };
    if (shouldRemoveWinDescription) {
        if (initialOutput.game.hasOwnProperty('win')) {
            //@ts-ignore
            initialOutput.game.win = 0;
        }

        if (initialOutput.game.hasOwnProperty('winDescription')) {
            //@ts-ignore
            delete initialOutput.game.winDescription;
        }
    }
    const returnMsg: IGameOutputFormatFull<
        IGameStateFormat,
        ePaths,
        tWallet
    > = Object.assign(
        { input: initialOutput },
        { meta },
        { path: pathCommandName }
    );

    return returnMsg;
}
