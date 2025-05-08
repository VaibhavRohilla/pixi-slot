import SlotStateAbstract from './slotStateAbstract';

export default class StateAskServerForBet extends SlotStateAbstract {
    private waitForData = false;

    constructor() {
        super('StateAskServerForBet');
    }

    protected onEnter(): void {
        this.waitForData = false;
        this.eventEmitter.emit('event-send-to-server-bet', this.attachedData);
    }

    protected create(): void {
        // this.onThisStateEvent("preload-complete", () => {
        //     console.log("StateConnecting")
        //     this.myStateMachine.setCurrentState("StateIdle");
        // }, this);

        this.onThisStateEvent(
            'event-recieve-from-server',
            (arg) => this.initDataArrived(arg),
            this
        );
        this.onThisStateEvent(
            'event-current-data-updated',
            (data) => this.currentDataArrived(data),
            this
        );

        this.onThisStateEvent(
            'event-error-popup',
            () => {
                this.myStateMachine.setCurrentState(
                    'StateConnecting',
                    this.slotData
                );
            },
            this
        );
    }

    initDataArrived(input: any): void {
        if (input.hasOwnProperty('isInitMsg') && input.isInitMsg) {
            return;
        }

        this.waitForData = true;
        console.log('betDataArrived', this, input);
        this.eventEmitter.emit(
            'event-update-current-data-with-server-data',
            input
        );
    }

    currentDataArrived(data): void {
        if (this.waitForData) {
            this.slotData = data;
            this.waitForData = false;
            this.myStateMachine.setCurrentState('StateIdle', data);
        }
    }
}
