import { IWinDataPresenter } from '../../../dataPresenter/interfaces';
import { configAnimationWin } from '@specific/config';

export function animationShowLineWin(
    emitter: Phaser.Events.EventEmitter,
    lineWinData: IWinDataPresenter
): void {
    if (lineWinData.lineIndex >= 0) {
        console.log(
            'animationShowLineWin(), event-show-single-line',
            lineWinData
        );
        emitter.emit('event-show-single-line', lineWinData.lineIndex, 500);
    } else {
        emitter.emit('event-stop-winlines-showing');
    }
    if (configAnimationWin.showNearLineAmounts) {
        emitter.emit('event-start-textPopup-singleLineWin', lineWinData.win);
    } else {
        emitter.emit('event-start-textPopup-lineWin', lineWinData.win);
    }
    emitter.emit('event-animate-symbols', lineWinData.affectedSymbolBits);
    emitter.emit('event-stop-bigwin-win');
}
