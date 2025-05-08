import SlotStateAbstract from './slotStateAbstract';

export default class StatePresentWin extends SlotStateAbstract {
    constructor() {
        super('StatePresentWin');
    }

    protected onEnter(): void {
        //hook
    }

    protected create(): void {
        this.onThisStateEvent(
            'event-animation-win-ended',
            () => this.endState(),
            this
        );
        this.onThisStateEvent(
            'event-count-end-textPopup-lineWin',
            () => this.endState(),
            this
        );

        // this.onThisStateEvent(`event-user-input-${eUserInputCommands.spinPressed}`, () => {
        //     this.eventEmitter.emit("event-animation-win-interrupt");
        // }, this);
    }

    private endState(): void {
        this.eventEmitter.emit(
            'event-update-current-win-data-with-future-data'
        );
        this.myStateMachine.setCurrentState('StatePostWin', this.slotData);
    }
}
