import { initKeyboardInputEvents } from './inputEventsKeyboard';
import { initButtonInputEvents } from './inputEventsButtons';
import { eUserInputCommands } from './userInputCommands';
import { CURRENCY } from '@specific/dataConfig';
import { THREE_SECOND_RULE } from '@specific/config';

export let noErrorPopup = true;

export default function initUserInputEvents(scene: Phaser.Scene): void {
    scene.game.events.on('event-error-popup', () => {
        scene.game.events.emit('event-close-popups');
        scene.game.events.emit(
            `event-user-input-${eUserInputCommands.stopAutospin}`
        );
        noErrorPopup = false;
    });

    scene.game.events.on('event-error-popup-closed', () => {
        console.log('ON event-error-popup-closed');
        noErrorPopup = true;
    });

    initKeyboardInputEvents(scene);
    initButtonInputEvents(scene);

    scene.game.events.on(
        `event-user-input-${eUserInputCommands.spinPressed}`,
        () => {
            console.log(`event-user-input-${eUserInputCommands.spinPressed}`)
        }
    );
    scene.game.events.on(
        `event-user-input-${eUserInputCommands.betPopup}`,
        () => {
            console.log(`event-user-input-${eUserInputCommands.betPopup}`)
        }
    );
    scene.game.events.on(
        `event-user-input-${eUserInputCommands.betRequest}`,
        () => {
            console.log(`event-user-input-${eUserInputCommands.betRequest}`)
        }
    );

    scene.game.events.on(
        `event-user-input-${eUserInputCommands.showInfoPage}`,
        () => {
            console.log(`event-user-input-${eUserInputCommands.showInfoPage}`);

            scene.game.events.emit('event-close-popups');
            const event = new Event('html-event-show-infoPage');
            setTimeout(() => {
                document.dispatchEvent(event);
            }, 100);
        }
    );

    scene.game.events.on(
        `event-user-input-${eUserInputCommands.showRulesPage}`,
        () => {
            console.log(`event-user-input-${eUserInputCommands.showRulesPage}`);

            scene.game.events.emit('event-close-popups');
            const event = new CustomEvent('html-event-show-rulesPage', {
                detail: { CURRENCY, THREE_SECOND_RULE },
            });
            setTimeout(() => {
                document.dispatchEvent(event);
            }, 100);
        }
    );

    scene.game.events.on(
        `event-user-input-${eUserInputCommands.openHelpPage}`,
        () => {
            console.log(`event-user-input-${eUserInputCommands.openHelpPage}`);
            // scene.game.events.emit('event-close-popups');
            const event = new CustomEvent('html-event-open-help-page', {
                detail: { CURRENCY, THREE_SECOND_RULE },
            });
            document.dispatchEvent(event);
        }
    );

    scene.game.events.on('event-close-popups', () => {
        console.log('event-close-popups');
        scene.game.events.emit('event-close-html-popups');
    });

    scene.game.events.on('event-close-html-popups', () => {
        let event = new Event('html-event-close-infoPage');
        document.dispatchEvent(event);
        event = new Event('html-event-close-rulesPage');
        document.dispatchEvent(event);
    });

    scene.game.events.on(
        `event-user-input-${eUserInputCommands.showSettingsPage}`,
        () => {
            console.log(
                `event-user-input-${eUserInputCommands.showSettingsPage}`
            );

            scene.game.events.emit('event-open-settings-popup');
        }
    );

    scene.game.events.on(
        `event-user-input-${eUserInputCommands.backToLobby}`,
        () => {
            console.log(`event-user-input-${eUserInputCommands.backToLobby}`);

            scene.game.events.emit('event-lobby-command');
        }
    );
}
