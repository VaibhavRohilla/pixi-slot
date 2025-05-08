import { eUserInputCommands } from '../gameFlow/userInput/userInputCommands';

export function createCheatTool(scene: Phaser.Scene): void {
    const domElem = document.createElement('form');
    domElem.innerHTML = '<form>';
    const fieldsNum = 5;
    for (let i = 0; i < fieldsNum; i++) {
        domElem.innerHTML +=
            `<label for="fname">reel${i + 1}:</label>` +
            `<input id=cheatField${i} type="number" min="0" name="fname" value="0"><br>`;
    }
    domElem.innerHTML +=
        '<br><br>' +
        '<label for="bonus">Bonus: </label>' +
        '<input id=bonusField  type="number" name="bonus" value="0"<br>';
    domElem.innerHTML +=
        '<br><br>' +
        '<label for="fname">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</label>' +
        '<input type="button" value="Cheat" id="cheatButtonCheat">' +
        '<label for="fname">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</label>' +
        '<input type="button" value="Cancel" id="cheatButtonCancel">' +
        '</form> ';
    const dom = scene.add.dom(0, 0, domElem);
    dom.setScale(5);
    dom.setVisible(false).setActive(false);

    document
        .getElementById('cheatButtonCheat')
        .addEventListener('click', () => {
            const array = [];
            for (let i = 0; i < fieldsNum; i++) {
                //@ts-ignore
                let a = document.getElementById('cheatField' + i).value;
                a = Math.abs(Number(a));
                array.push(a);
                //@ts-ignore
                document.getElementById('cheatField' + i).value = a;
            }
            const bonus = JSON.parse(
                (<HTMLInputElement>document.getElementById('bonusField')).value
            );

            array.push(Math.abs(Number(bonus)));

            //dom.setActive(false).setVisible(false);
            //let array = document.getElementById("cheatInput").value;
            console.log('array', array);
            scene.game.events.emit(
                `event-user-input-${eUserInputCommands.spinPressed}`,
                Phaser.Input.Keyboard.KeyCodes.F,
                array
            );
            //document.getElementById("cheatButton").setAttribute("value",  document.getElementById("cheatInput").getAttribute("value"))
            dom.setVisible(false).setActive(false)
        });

    document
        .getElementById('cheatButtonCancel')
        .addEventListener('click', () =>
            dom.setVisible(false).setActive(false)
        );

    scene.game.events.on(
        'event-open-cheat-tool',
        () => dom.setVisible(true).setActive(true),
        this
    );
}
