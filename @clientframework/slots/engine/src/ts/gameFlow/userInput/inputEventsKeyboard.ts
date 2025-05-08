import { eUserInputCommands } from './userInputCommands';
import { noErrorPopup } from './initUserInputEvents';
import { noBasePopup } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/GameObjects/popups/basePopup';
import { getKeyboardShortcutsEnabled } from '../../dataPresenter/defaultConfigSlot';

export function initKeyboardInputEvents(scene: Phaser.Scene): void {
    scene.input.keyboard.on('keyup', function (event) {
        switch (event.keyCode) {
            case Phaser.Input.Keyboard.KeyCodes.SPACE:
                noErrorPopup && noBasePopup &&
                    scene.game.events.emit(
                        `event-user-input-${eUserInputCommands.spinPressed}`,
                        Phaser.Input.Keyboard.KeyCodes.SPACE
                    );
                break;
            case Phaser.Input.Keyboard.KeyCodes.B:
                if (getKeyboardShortcutsEnabled()) {
                    noErrorPopup &&
                        scene.game.events.emit(
                            `event-user-input-${eUserInputCommands.betPopup}`
                        );
                }
                break;
            case Phaser.Input.Keyboard.KeyCodes.F: {
                if (getKeyboardShortcutsEnabled()) {
                    const isForcing = 1;
                    noErrorPopup &&
                        scene.game.events.emit(
                            `event-user-input-${eUserInputCommands.spinPressed}`,
                            Phaser.Input.Keyboard.KeyCodes.F,
                            isForcing
                        );
                }
                break;
            }
        }
    });
}
