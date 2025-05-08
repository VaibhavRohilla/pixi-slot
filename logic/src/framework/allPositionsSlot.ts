import * as Helpers from './helpers';
import { StandardSlot } from '../criticalFiles/standardSlot';
import { ISlotInfo } from './interfaces';
import { IGameConfig, IRNG } from './models/gamesAbstractModels';
import { IBet } from './models/bet';
import { IWinData } from './models/winData';
import AllPositionsPayout from './allPositionsPayout';

export default abstract class AllPositionsSlot<Symbols> extends StandardSlot<
    Symbols
> {
    protected info: ISlotInfo<Symbols>;
    protected constructor(
        info: ISlotInfo<Symbols>,
        gameConfig: IGameConfig,
        rng: IRNG
    ) {
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
        specialSymbol: number,
        bonusIndex: number
    ): IWinData {
        return Helpers.countBonusSymbols(
            this.info,
            this.State.screen,
            specialSymbol,
            bonusIndex
        );
    }

    protected calculatePayout(screen: number[][], bet: IBet): any {
        const payout = new AllPositionsPayout<Symbols>(this.info);

        return payout.getPayoutAllPositions(screen, bet);
    }
}
