import SlotStateAbstract from './slotStateAbstract';
import { eUserInputCommands } from '../userInput/userInputCommands';

import { isPrewinCondition } from '@specific/specifics/isPrewinCondition';

export default class StatePreWin extends SlotStateAbstract {
    allowPressSpaceToSkip = true;

    constructor() {
        super('StatePreWin');
    }

    protected onEnter(): void {
        if (isPrewinCondition(this.slotData)) {
            this.eventEmitter.emit(
                'event-animation-prewin-start',
                this.slotData
            );
        } else {
            this.endState();
        }
    }

    protected create(): void {
        this.onThisStateEvent(
            'event-animation-prewin-ended',
            () => {
                this.endState();
            },
            this
        );

        this.onThisStateEvent(
            `event-user-input-${eUserInputCommands.spinPressed}`,
            (arg) => {
                if (
                    !(
                        arg == Phaser.Input.Keyboard.KeyCodes.SPACE &&
                        !this.slotData.settings.spaceForSpin
                    )
                ) {
                    // if (false && this.allowPressSpaceToSkip) {
                    //     this.eventEmitter.emit(
                    //         'event-animation-prewin-end',
                    //         this.slotData
                    //     );
                    // }
                }
            },
            this
        );
    }

    private endState(): void {
        if (this.slotData.winDescription.affectedSymbolBits > 0) {
            this.myStateMachine.setCurrentState(
                'StatePresentWin',
                this.slotData
            );
        } else {
            this.myStateMachine.setCurrentState('StatePostWin', this.slotData);
        }
    }
}
