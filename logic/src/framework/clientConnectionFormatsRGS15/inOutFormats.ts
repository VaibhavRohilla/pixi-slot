import {
    SlotGameOutputFormatFull as iOutputFull,
    SlotGameOutputStateAccount as iOutputStateAccountResolved,
    SlotGameOutputState as iOutputState,
} from './slotGame/slotGameOutputFormats';
import {
    ePathSlotCommands as ePathCommands,
    BetDirectionType as tBetValues,
} from './slotGame/slotGameCommands';
import ClientInputPort from './slotGame/slotGameClientInputPort';
import { IWinDescription } from '../models/winDescription';

export {
    iOutputFull,
    iOutputStateAccountResolved,
    iOutputState,
    ePathCommands,
    tBetValues,
    ClientInputPort,
    IWinDescription,
};

//export enum ePathCommands;
