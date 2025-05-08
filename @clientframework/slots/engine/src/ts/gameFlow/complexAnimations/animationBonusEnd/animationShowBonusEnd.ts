import { BigWinAnimationType } from '../../../game-objects/particles/particleWinAnimation';

export function animationShowBonusEnd(
    emitter: Phaser.Events.EventEmitter,
    totalWin: number
): void {
    console.log('animationShowBonusEnd()', totalWin);

    emitter.emit(
        'event-start-bigwin-lineWinCoins',
        BigWinAnimationType.lineWin
    );
    emitter.emit(
        'event-start-textPopup-totalFreespinsWinPopupAmount',
        totalWin,
        0
    );

    emitter.emit('event-start-popup-totalFreespinsWin');

    //emitter.emit(`event-start-bigwin-${winEventSuffix}`, bigWinType,);
    //emitter.emit("event-start-winpopup-winA", WinAnimationType.win);
}

export function animationStopBonusEnd(
    emitter: Phaser.Events.EventEmitter
): void {
    //emitter.emit("event-stop-bigwin-win");
    emitter.emit('event-stop-textPopup-totalFreespinsWinPopupAmount');
    emitter.emit('event-stop-popup-totalFreespinsWin');
    emitter.emit('event-stop-textPopup-totalWin');
}
