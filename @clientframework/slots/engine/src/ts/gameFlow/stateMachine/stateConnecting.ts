import SlotStateAbstract from './slotStateAbstract';

export default class StateConnecting extends SlotStateAbstract {
    private waitForData = false;

    constructor() {
        super('StateConnecting');
    }

    oldData;

    protected onEnter(): void {
        this.oldData = JSON.parse(JSON.stringify(this.slotData));
        this.waitForData = false;
    }

    protected create(): void {
        // this.onThisStateEvent("preload-complete", () => {
        //     console.log("StateConnecting")
        //     this.myStateMachine.setCurrentState("StateIdle");
        // }, this);

        this.onThisStateEvent(
            'event-error-popup-closed',
            (wasResponsible) => {
                if (wasResponsible) {
                    this.myStateMachine.setCurrentState(
                        'StateIdle',
                        this.slotData
                    );
                }
            },
            this
        );

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
    }

    initDataArrived(input: any): void {
        this.waitForData = true;
        console.log('initDataArrived', this, input);
        this.eventEmitter.emit(
            'event-update-current-data-with-server-data',
            input
        );
        if (this.slotData.isRecovery) {
            this.eventEmitter.emit(
                'event-update-future-data-with-server-data',
                input
            );
        }
    }

    currentDataArrived(data): void {
        if (this.waitForData) {
            this.slotData = data;
            this.waitForData = false;
            console.log(
                'Connection, oldData, slotData',
                this.oldData,
                this.slotData
            );

            this.myStateMachine.setCurrentState('StateIdle', data);
            if (this.oldData) {
                this.myStateMachine.setCurrentState(
                    'StateAskServerForBet',
                    this.oldData.status.bet / this.oldData.status.currentLines
                );
            }
        }
    }
}
