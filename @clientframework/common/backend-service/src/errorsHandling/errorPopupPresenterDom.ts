import { getLobbyUrl } from '../launchParams/lobbyUrl';

export function createErrorButtons(
    scene: Phaser.Scene,
    buttons: any[]
): Phaser.GameObjects.DOMElement {
    const domElem = document.getElementById('errorPopupForm');
    const quitGameElem = document.getElementById('quitText');
    for (let i = 0; i < buttons.length; i++) {
        // each should log its value.

        const str = `<input style='margin-right: 2px;' type="button" value=" ${buttons[i].text} " id="errorButton-${buttons[i].action}">`;

        domElem.innerHTML += str;
        console.log('created element,', domElem.innerHTML);

        console.log(`creating errorButton-${buttons[i].action}`);

        const button = document.getElementById(
            `errorButton-${buttons[i].action}`
        );

        console.log(button);

        scene.game.events.on(
            `event-show-error-button-${buttons[i].action}`,
            () => {
                console.log('show button', buttons[i].action);
                dom.setVisible(true).setActive(true);
            },
            this
        );
    }

    scene.game.events.on(
        `event-error-popup-closed`,
        () => dom.setVisible(false).setActive(false),
        this
    );

    scene.game.events.on('event-error-popup-force-void', () => {
        if (getLobbyUrl() === '') {
            quitGameElem.style.display = 'block';
        }
    });

    domElem.childNodes.forEach((button: any, i: number) => {
        const event = `event-error-popup-force-${buttons[i].action}`;
        button.addEventListener('click', () => {
            console.log(
                `error-button-${buttons[i].action} clicked, event = ${event}`
            );
            scene.game.events.emit(
                `event-error-button-clicked-${buttons[i].action}`
            );
            scene.game.events.emit(event);
        });
    });

    const dom = scene.add.dom(0, 0, domElem);

    if (buttons.length > 1) {
        dom.setScale(4.5);
    } else {
        dom.setScale(5);
    }

    dom.setVisible(false).setActive(false);
    return dom;
}
