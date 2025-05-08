import { ISlotDataPresenter } from '../../../dataPresenter/interfaces';
import { BigWinAnimationType } from '../../../game-objects/particles/particleWinAnimation';
import { doAllLineWinsSpecificPart } from '@specific/specifics/doAllLineWinsSpecificPart';
import { configAnimationWin } from '@specific/config';

function getWinMultipliedBy(slotDataPresenter: ISlotDataPresenter): number {
    const win = slotDataPresenter.futureStatus.win;
    const bet = slotDataPresenter.futureStatus.bet;
    return win / bet;
}

function getWinType(winMultipliedBy: number): BigWinAnimationType {
    let winType: BigWinAnimationType = BigWinAnimationType.lineWin;

    if (winMultipliedBy >= 10) {
        winType = BigWinAnimationType.midWin;
    }
    if (winMultipliedBy >= 100) {
        winType = BigWinAnimationType.bigWin;
    }
    if (winMultipliedBy >= 1000) {
        winType = BigWinAnimationType.megaWin;
    }
    return winType;
}

export function animationShowAllLineWins(
    emitter: Phaser.Events.EventEmitter,
    slotDataPresenter: ISlotDataPresenter,
    backgroundWinDuration: number
): void {
    //const shouldAnimateFlameFrame = false;
    let bigWinType: BigWinAnimationType = null;
    const lineIndexes = [];
    const affectedSymbolBits =
        slotDataPresenter.winDescription.affectedSymbolBits; // TODO - put to data presenter

    const winAnimationDuration = backgroundWinDuration;

    // check if has winx2
    slotDataPresenter.winDescription.lineWins.forEach((element) => {
        if (element.lineIndex >= 0) {
            lineIndexes.push(element.lineIndex);
        }
    });

    const winMultipliedBy = getWinMultipliedBy(slotDataPresenter);
    bigWinType = getWinType(winMultipliedBy);
    if (winMultipliedBy >= 15) {
        emitter.emit('event-start-popup-winBackLight');
    }

    if (lineIndexes.length > 0) {
        console.log(
            'animationShowLineWin(), event-show-multiple-lines',
            lineIndexes
        );
        emitter.emit('event-show-multiple-lines', lineIndexes, 500);
    }

    if (configAnimationWin.winStaysConstantlyInFreeSpins) {
        emitter.emit(
            'event-start-textPopup-lineWin',
            slotDataPresenter.futureStatus.win,
            0,
            true,
            slotDataPresenter.status.freeSpins.totalSpins == 0
        );
        if (slotDataPresenter.status.freeSpins.totalSpins > 0) {
            // && slotDataPresenter.status.freeSpins.currentSpin > 0) {
            emitter.emit(
                'event-start-textPopup-totalWin',
                slotDataPresenter.futureStatus.freeSpins.totalWin,
                slotDataPresenter.status.freeSpins.totalWin,
                false
            );
        } else {
            emitter.emit('event-stop-textPopup-totalWin');
        }
    } else {
        console.log(
            'animationShowLineWin(), event-show-multiple-lines',
            lineIndexes
        );
        emitter.emit('event-show-multiple-lines', lineIndexes, 500);
        emitter.emit(
            'event-start-textPopup-lineWin',
            slotDataPresenter.futureStatus.win,
            0
        );
    }

    emitter.emit('event-animate-symbols', affectedSymbolBits);

    const winEventSuffix =
        bigWinType === BigWinAnimationType.lineWin ? 'lineWinCoins' : 'win';
    emitter.emit(`event-start-bigwin-${winEventSuffix}`, bigWinType);

    doAllLineWinsSpecificPart(
        emitter,
        slotDataPresenter,
        winAnimationDuration,
        winMultipliedBy
    );
}
