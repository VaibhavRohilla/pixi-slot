import { StandardSlot } from '../criticalFiles/standardSlot';
import { ISlotInfo } from '../framework/interfaces';
import { IGameConfig, IRNG } from '../framework/models/gamesAbstractModels';
import { IBet } from '../framework/models/bet';
import { IWinData } from '../framework/models/winData';
import LeftToRightPayout from '../criticalFiles/leftToRightPayout';
import * as Helpers from '../framework/helpers';

export default abstract class LeftToRightSlot<Symbols> extends StandardSlot<
    Symbols
> {
    protected info: ISlotInfo<Symbols>;
    constructor(info: ISlotInfo<Symbols>, gameConfig: IGameConfig, rng: IRNG) {
        super(info, gameConfig, rng);
        this.info = info;
    }

    protected scatterWin(
        screen,
        scatterSymbol: number,
        bet: IBet,
        scatterIndex: number,
        noWinSymbolsThreshold = 0
    ): IWinData {
        return Helpers.scatterWin(
            this.info,
            screen,
            scatterSymbol,
            bet,
            scatterIndex,
            noWinSymbolsThreshold
        );
    }

    protected countBonusSymbols(
        screen,
        specialSymbol,
        bonusIndex: number
    ): IWinData {
        return Helpers.countBonusSymbols(
            this.info,
            screen,
            specialSymbol,
            bonusIndex
        );
    }

    protected calculatePayout(
        screen: number[][],
        bet: IBet,
        wild?: number
    ): any {
        const evaluate = new LeftToRightPayout<Symbols>(this.info);

        return evaluate.getPayoutLeftToRight(screen, bet, wild);
    }
}
