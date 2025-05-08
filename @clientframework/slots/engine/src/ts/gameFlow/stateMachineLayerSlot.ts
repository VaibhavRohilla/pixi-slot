import StateMachineLayer from '@commonEngine/gameFlow/stateMachineLayer';
import addStatesToStateMachine from './stateMachine/addStatesToStateMachine';
import initUserInputEvents from './userInput/initUserInputEvents';
import { initDataPresenterEvents } from '../dataPresenter/initDataPresenterEvents';
import initComplexAnimationsEvents from './complexAnimations/initComplexAnimationsEvents';

export default class StateMachineLayerSlot extends StateMachineLayer {
    protected complexAnimations;
    protected initStatesEventsUserInputEtc(): void {
        this.addStates();
        this.addInputs();
        this.initPreseneter();
        this.initAnimations();
    }

    protected addStates(): void {
        addStatesToStateMachine(this.stateMachine);
    }

    protected addInputs(): void {
        initUserInputEvents(this);
    }

    protected initPreseneter(): void {
        initDataPresenterEvents(this.game.events);
    }

    protected initAnimations(): void {
        this.complexAnimations = initComplexAnimationsEvents(this);
    }

    // updateDebugTextList() {
    //     super.updateDebugTextList();
    // }
}
