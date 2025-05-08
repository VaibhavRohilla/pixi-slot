import StateMachine from '@commonEngine/gameFlow/stateMachine';
import StateIdle from './stateIdle';
import StateConnecting from './stateConnecting';
import StateAskServerBeforeSpin from './stateAskServerBeforeSpin';
import StatePresentSpinning from './statePresentSpinning';
import StatePreWin from './statePreWin';
import StatePresentWin from './statePresentWin';
import StateBeforeEnd from './stateBeforeEnd';
import StateAskServerForBet from './stateAskServerForBet';
import StateBonusPopup from './stateBonusPopup';
import StatePostWin from './statePostWin';
import StateAskServerForHistory from './stateAskServerForHistory';

export default function addStatesToStateMachine(
    stateMachine: StateMachine<Phaser.Scene>
): void {
    stateMachine.addState(new StateConnecting());
    stateMachine.addState(new StateIdle());
    stateMachine.addState(new StateAskServerBeforeSpin());
    stateMachine.addState(new StatePresentSpinning());
    stateMachine.addState(new StatePreWin());
    stateMachine.addState(new StatePresentWin());
    stateMachine.addState(new StatePostWin());
    stateMachine.addState(new StateBeforeEnd());
    stateMachine.addState(new StateBonusPopup());
    stateMachine.addState(new StateAskServerForHistory());
    stateMachine.addState(new StateAskServerForBet());

    stateMachine.setCurrentState('StateConnecting');
}
