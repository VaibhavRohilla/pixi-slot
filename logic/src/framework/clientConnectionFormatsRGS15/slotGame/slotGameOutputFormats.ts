import { IMainSLot } from '../../models/games';
import {
    IGameOutputFormatStateAccount,
    IGameOutputFormatFull,
    createGameOutputObjectMsg,
} from '../game/gameOutputFormats';
import { ePathSlotCommands } from './slotGameCommands';
import Wallet from '../../tests/fake-wallet';

export type SlotGameOutputState = IMainSLot;

export type SlotGameOutputStateAccount = IGameOutputFormatStateAccount<
    SlotGameOutputState,
    Wallet
>;

export type SlotGameOutputFormatFull = IGameOutputFormatFull<
    SlotGameOutputState,
    ePathSlotCommands,
    Wallet
>;

export function createSlotGameOutputObject(
    gameState: SlotGameOutputState,
    account: Wallet,
    pathCommandName: ePathSlotCommands,
    shouldRemoveWinDescription = false,
    meta: any = {}
): SlotGameOutputFormatFull {
    const returnMsg: SlotGameOutputFormatFull = createGameOutputObjectMsg<
        SlotGameOutputState,
        ePathSlotCommands,
        Wallet
    >(
        gameState,
        account,
        pathCommandName == ePathSlotCommands.init
            ? pathCommandName
            : ePathSlotCommands.action,
        shouldRemoveWinDescription,
        meta
    );

    return returnMsg;
}

export function getTotalWin(gameState: SlotGameOutputState): number {
    return gameState.hasOwnProperty('winDescription')
        ? gameState.winDescription.totalWin
        : 0;
}

export function getTotalBet(gameState: SlotGameOutputState): number {
    return gameState.bet.current * gameState.bet.lines.current;
}
