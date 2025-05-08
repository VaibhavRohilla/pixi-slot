import { ISlotDataPresenter } from '@clientframework/slots/engine/src/ts/dataPresenter/interfaces';
import { WinAnimationType } from '@clientframework/slots/engine/src/ts/game-objects/WinPopupAnimation';
import EightGoldenLionsInfo from '@logic/criticalFiles/eightGoldenDragonsInfo';

export function doAllLineWinsSpecificPart(
    emitter: Phaser.Events.EventEmitter,
    slotDataPresenter: ISlotDataPresenter,
    winAnimationDuration: number,
    winMultipliedBy: number
): void {
    let hasPrizeWin = false;
    slotDataPresenter.winDescription.scatterWins.forEach((element) => {
        if (
            element.sym === EightGoldenLionsInfo.Symbols.Mask &&
            element.win > 0
        ) {
            emitter.emit('event-start-prize-win', element.count);
            emitter.emit(
                'event-start-prize-win-sound',
                winAnimationDuration,
                winMultipliedBy
            );
            hasPrizeWin = true;
        }
    });

    emitter.emit('event-start-winpopup-winA', WinAnimationType.win);
    if (!hasPrizeWin) {
        //this is for sound
        emitter.emit(
            'event-animate-background-win',
            winAnimationDuration,
            winMultipliedBy
        );
    }
    if (winMultipliedBy > 1) {
        emitter.emit('event-start-lightsFrame', 0, 500);
    }
}
