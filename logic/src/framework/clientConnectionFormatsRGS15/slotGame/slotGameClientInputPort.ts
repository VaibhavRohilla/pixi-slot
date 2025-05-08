import { ePathSlotCommands, BetDirectionType } from './slotGameCommands';
import { IGameInput } from '../../models/gamesAbstractModels';
import {
    GameClientInputPort,
    IGameInputFormat,
} from '../game/gameClientInputPort';

type BetDirectionInputAttribute = { direction: BetDirectionType };

export default class SlotGameClientInputPort extends GameClientInputPort<
    ePathSlotCommands
> {
    constructor(usingRGSData: boolean) {
        super(usingRGSData);
    }

    getBetInputObject(
        betValue: BetDirectionType
    ): IGameInputFormat<ePathSlotCommands> {
        console.log('creating bet input');
        return super.getInputObject<{ gameInput: IGameInput }>(
            ePathSlotCommands.action,
            {
                gameInput: {
                    actionType: ePathSlotCommands.bet,
                    actionInput: {
                        direction: betValue,
                    },
                },
            }
        );
    }

    getPlayInputObject(isForcing?: any): IGameInputFormat<ePathSlotCommands> {
        console.log('creating play input', isForcing);
        const input = {
            gameInput: {
                actionType: ePathSlotCommands.play,
            },
        };
        if (isForcing !== undefined) {
            Object.assign(input.gameInput, {
                actionInput: {
                    force: isForcing,
                },
            });
        }
        return super.getInputObject<{ gameInput: IGameInput }>(
            ePathSlotCommands.action,
            input
        );
    }

    getInitInputObject(): IGameInputFormat<ePathSlotCommands> {
        console.log('creating init input');

        return super.getInputObject(ePathSlotCommands.init, {});
    }
}
