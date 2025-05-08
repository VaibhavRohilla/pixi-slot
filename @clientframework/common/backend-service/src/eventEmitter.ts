let events: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter();
const listenersList: { func: Function; context: any }[] = [];

export function setEventEmitter(
    eventEmitter: Phaser.Events.EventEmitter
): void {
    events = eventEmitter;
    listenersList.forEach((element) => {
        events.on('event-emmitter-set', element.func, element.context);
    });
    events.emit('event-emmitter-set');
}

export function getEventEmitter(): Phaser.Events.EventEmitter {
    return events;
}

export function onEventEmitterSet(func: Function, context: any): void {
    console.log('onEventEmitterSet, func', func);
    listenersList.push({ func, context });
}
