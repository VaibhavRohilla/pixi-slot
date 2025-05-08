import SlotStateAbstract from './slotStateAbstract';
import { eUserInputCommands } from '../userInput/userInputCommands';
import { ISlotDataPresenter } from '../../dataPresenter/interfaces';
import { configAnimationWin } from '@specific/config';
import { getPresentExpandingWinsInPostWin } from '../../dataPresenter/defaultConfigSlot';

export function postWinConditionExpanding(
    slotData: ISlotDataPresenter
): boolean {
    console.log('postWinConditionExpanding', slotData);
    return (
        slotData.winDescription.expandingWin &&
        slotData.winDescription.expandingWin.affectedSymbolBits > 0
    );
}

let isPostWin: (slotData: ISlotDataPresenter) => boolean = () => false;

export function setPostWinConditon(
    newCondtion: (slotData: ISlotDataPresenter) => boolean
): void {
    isPostWin = newCondtion;
}

export default class StatePostWin extends SlotStateAbstract {
    allowPressSpaceToSkip = true;

    constructor(
        public showPostWin: (
            emitter: Phaser.Events.EventEmitter,
            slotData: ISlotDataPresenter
        ) => void = null
    ) {
        super('StatePostWin');
    }

    protected onEnter(): void {
        if (isPostWin(this.slotData)) {
            this.myStateMachine.eventEntity.time.addEvent({
                delay: 1000,
                callback: () => {
                    this.eventEmitter.emit('event-animation-win-interrupt');
                    this.eventEmitter.emit(
                        'event-animation-postwin-start',
                        this.slotData
                    );
                },
                callbackScope: this,
                loop: false,
            });
        } else {
            this.endState();
        }
    }

    protected create(): void {
        this.onThisStateEvent(
            'event-animation-postwin-ended',
            () => {
                if (
                    getPresentExpandingWinsInPostWin() &&
                    this.slotData.status.freeSpins.totalSpins > 0
                ) {
                    console.log('POSTPOST');
                    this.showPostWin &&
                        this.showPostWin(this.eventEmitter, this.slotData);

                    setTimeout(
                        () => this.endState(),
                        configAnimationWin.lineByLineDuration
                    );
                } else {
                    this.endState();
                }

                // this.endState();
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
                    //         'event-animation-postwin-end',
                    //         this.slotData
                    //     );
                    // }
                }
            },
            this
        );
    }

    private endState(): void {
        this.myStateMachine.setCurrentState('StateBonusPopup', this.slotData);
    }
}
