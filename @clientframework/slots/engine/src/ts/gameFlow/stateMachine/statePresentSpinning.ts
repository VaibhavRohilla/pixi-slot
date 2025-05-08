import { eUserInputCommands } from '../userInput/userInputCommands';
import SlotStateAbstract from './slotStateAbstract';

export default class StatePresentSpinning extends SlotStateAbstract {
    constructor() {
        super('StatePresentSpinning');
    }

    startedRotationsCnt = 0;

    protected onEnter(): void {
        //setTimeout(() => this.eventEmitter.emit("event-animation-rotation-end"), 100);
    }

    protected create(): void {
        this.onThisStateEvent(
            'event-animation-rotation-end',
            (win): void => {
                win;
                this.myStateMachine.setCurrentState(
                    'StatePreWin',
                    this.slotData
                );
            },
            this
        );

        this.onThisStateEvent(
            `event-user-input-${eUserInputCommands.spinPressed}`,
            () => {
                this.eventEmitter.emit('event-animation-rotation-interrupt');
            },
            this
        );

        this.onThisStateEvent(
            'event-animation-rotation-interrupt',
            () => {
                //setTimeout(() => this.eventEmitter.emit("event-animation-rotation-end"), 300);
            },
            this
        );
    }
}
