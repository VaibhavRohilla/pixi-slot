import StateMachine from './stateMachine';

export default abstract class StateAbstract<ControlEntity> {
    protected abstract onEnter();

    protected onExit(): void {
        //this.attachedData = null;
    }

    protected create(): void {
        //hook
    }

    get isActive(): boolean {
        return this.myStateMachine.currentState === this;
    }

    get eventEmitter(): Phaser.Events.EventEmitter {
        return this.myStateMachine.eventEmitter;
    }

    constructor(
        public readonly key,
        protected upperState: StateAbstract<ControlEntity> = null
    ) {}

    protected myStateMachine: StateMachine<ControlEntity> = null;

    protected stateTime = -1;

    // should be used only inside of states
    protected subStateMachine: StateMachine<ControlEntity> = null;

    // this is for thigs that will be processed later !!
    // attached message data. usually before starting of spin.
    // Note that, by good practice, this thould be removed after firs tick.
    protected attachedData: any = null;

    protected oldKey = '';
    protected newKey = '';

    onThisStateEvent(eventKey: string, func: Function, context: any): void {
        this.eventEmitter.on(
            eventKey,
            (...args) => {
                if (context.myStateMachine.currentState.key != context.key) {
                    return;
                }
                console.log(
                    `------this state (${context.myStateMachine.currentState.key} == ${context.key}) event (${eventKey})passed-----`
                );
                func(...args);
            },
            context
        );
    }

    //////////////////////////////////////////////////////////////////////////////

    //protected attachedData : Control.Message = null;
    _attachDataIntern(data: any): void {
        this.attachedData = data;
    }

    _clearAttachedDataIntern(): void {
        this.attachedData = null;
    }

    // this is for thigs that will be processed immediately !!
    //abstract _onMessage(message : Message);

    _onEnterIntern(data: any): void {
        this._attachDataIntern(data);
        console.log(`event-state-${this.key}-onEnter`, data);
        this.eventEmitter.emit(`event-state-${this.key}-onEnter`, data);
        this.onEnter();
        this._clearAttachedDataIntern();
    }

    _onExitIntern(newStateKey: string): void {
        this.newKey = newStateKey;
        this.oldKey = this.key;
        console.log(`event-state-${this.key}-onExit`);
        this.eventEmitter.emit(`event-state-${this.key}-onExit`);
        this.onExit();
    }

    _createIntern(stateMachine: StateMachine<ControlEntity>): void {
        this.myStateMachine = stateMachine;
        console.log(`event-state-${this.key}-create`);
        this.eventEmitter.emit(`event-state-${this.key}-create`);
        this.create();
    }

    /*onUpdate() {
	}*/
    // called only by state manager
    // _connectWithEntityAndCallCreateIntern(val : ControlEntity) {
    // 	this.entity = val;
    // 	this.create();
    // }
}
