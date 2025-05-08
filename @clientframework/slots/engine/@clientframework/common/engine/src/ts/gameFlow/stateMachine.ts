import StateAbstract from './stateAbstract';

export default class StateMachine<ControlEntity> {
    get eventEmitter(): Phaser.Events.EventEmitter {
        return this._eventEmitter;
    }

    get eventEntity(): ControlEntity {
        return this._entity;
    }

    private _states: any = {};

    private _currentState: StateAbstract<ControlEntity> = null;

    get currentState(): StateAbstract<ControlEntity> {
        return this._currentState;
    }

    constructor(
        private _eventEmitter: Phaser.Events.EventEmitter,
        private _entity: ControlEntity = null
    ) {
        console.log('event-state-machine-created');
        this.eventEmitter.emit('event-state-machine-created', this);
    }

    setCurrentState(stateKey: string, data: any = null): void {
        if (this._states.hasOwnProperty(stateKey)) {
            if (this._currentState) {
                this._currentState._onExitIntern(stateKey);
            }

            this._currentState = this._states[stateKey];

            this._currentState._onEnterIntern(data);
        } else {
            ////delcons console.log("WARN - no such key " + stateKey);
        }
    }

    addState(stateObj: StateAbstract<ControlEntity>): void {
        if (stateObj == null) {
            ////delcons console.log("WARN - stateObj for key" + stateKey + "has" + stateObj + "value. no state would be added");
            return;
        }

        const stateKey = stateObj.key;
        stateObj._createIntern(this);

        // TODO check if symbol already exists
        if (this._states.hasOwnProperty(stateKey)) {
            ////delcons console.log("WARN - key " + stateKey + " already exists");
        }

        this._states[stateKey] = stateObj;

        if (this._currentState == null) {
            this._currentState = stateObj;
        }
        console.log(`addState ${stateKey}`);
    }

    //overwriteState(stateKey : string, stateObj : State) {
    //}

    getState(stateKey: string): StateAbstract<ControlEntity> {
        // TODO check if symbol already exists
        if (this._states.hasOwnProperty(stateKey)) {
            if (this._states[stateKey] == null) {
                ////delcons console.log("WARN findState - at key " + stateKey + " is null object's val");
            }

            return this._states[stateKey];
        }

        return null;
    }

    // this is for thigs that will be processed immediately !!
    // _onMessage(message : any) { // hook method
    //     if (this._currentState != null) {
    //         this._currentState._onMessage(message);
    //     }
    // }

    /*update() {
        if (this._currentState.val != null) {
            this._currentState.val.onUpdate();
        }
    }*/
}
