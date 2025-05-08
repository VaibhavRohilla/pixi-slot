import SpecificGame from '../../../criticalFiles/index';
import {
    createSlotGameOutputObject,
    getTotalWin,
    getTotalBet,
} from '../../clientConnectionFormatsRGS15/slotGame/slotGameOutputFormats';
import {
    ePathCommands,
    tBetValues,
    iOutputFull,
} from '../../clientConnectionFormatsRGS15/inOutFormats';
import { IGameConfig, IRNG } from '../../models/gamesAbstractModels';
import Wallet from '../fake-wallet';

export function createGameLogicAndWallet(
    rng: IRNG,
    skipWallet = false
): {
    specificGame: SpecificGame;
    wallet: Wallet;
    initialMsg: iOutputFull;
} {
    const gameConfig: IGameConfig = {
        rngType: 'GamingIsaac',
    };
    const specificGame = new SpecificGame(gameConfig, rng);
    const wallet = skipWallet ? null : new Wallet();

    return {
        specificGame,
        wallet,
        initialMsg: createSlotGameOutputObject(
            specificGame.State,
            wallet,
            ePathCommands.init,
            true
        ),
    };
}

export async function play(
    game: SpecificGame,
    fakeWallet: Wallet,
    meta: any = {},
    actionInput?
): Promise<iOutputFull> {
    // case - not enough balance
    if (
        fakeWallet.balance <
        game.State.bet.current * game.State.bet.lines.current
    ) {
        return createSlotGameOutputObject(
            game.State,
            fakeWallet,
            ePathCommands.play,
            false,
            meta
        );
    }

    const gameInput = actionInput
        ? { actionType: ePathCommands.play, actionInput }
        : { actionType: ePathCommands.play };

    await game.action(gameInput);

    fakeWallet.change(getTotalWin(game.State) - getTotalBet(game.State));

    return createSlotGameOutputObject(
        game.State,
        fakeWallet,
        ePathCommands.play,
        false,
        meta
    );
}

export async function bet(
    game: SpecificGame,
    value: tBetValues,
    fakeWallet: Wallet,
    meta: any = {}
): Promise<iOutputFull> {
    await game.action({
        actionType: ePathCommands.bet,
        actionInput: {
            direction: value,
        },
    });

    return createSlotGameOutputObject(
        game.State,
        fakeWallet,
        ePathCommands.bet,
        true,
        meta
    );
}
