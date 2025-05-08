export function animationShowLineWinStop(
    emitter: Phaser.Events.EventEmitter
): void {
    emitter.emit('event-stop-winlines-showing');
    emitter.emit('event-stop-textPopup-lineWin');
    emitter.emit('event-stop-textPopup-singleLineWin');
    emitter.emit('event-stop-winpopup-winA');
    emitter.emit('event-stop-winpopup-winX2A');
    emitter.emit('event-stop-bigwin-win');
    emitter.emit('event-stop-flameframe');
    emitter.emit('event-stop-lightsFrame', 500);
    emitter.emit('event-stop-animate-symbols');
    emitter.emit('event-stop-prize-win');

    emitter.emit('event-stop-winpopup-winX1');
    emitter.emit('event-stop-winpopup-winX2');
    emitter.emit('event-stop-winpopup-winX3');

    emitter.emit('event-stop-popup-winBackLight');
}
