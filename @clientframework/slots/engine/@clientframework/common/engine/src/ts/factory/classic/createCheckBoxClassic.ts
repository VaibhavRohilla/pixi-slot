import GameButton from '../../GameObjects/gameButton';

export function createCheckBoxClassic(
    eventKeyId: string,
    eventValue: number,
    scene: Phaser.Scene,
    text_: string,
    fontSize = 80
): GameButton {
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
        fontSize: `${fontSize}px`,
        fontFamily: 'Arial',
        align: 'left',
        rtl: false,
        color: '#fff',
        stroke: '#000',
        strokeThickness: 5,
    };
    // const backgroundWidthSizeFactor = 1.2;
    // const backgroundHeightSizeFactor = 1;
    // const backgroundColor = 0xff0000;
    // const backgroundColorOver = 0x00ff00;
    // const backgroundColorDown = 0x0000ff;
    // const backgroundColorSelected = 0x000000;
    // const backgroundColorSelectedOver = 0x000000;
    // const backgroundColorSelectedDown = 0x000000;
    // const borderColor = 0xffffff;
    // const alpha = 1;

    const text = text_.split('\n');

    const textField = new Phaser.GameObjects.Text(scene, 0, 0, text, style);
    textField.setOrigin(0.5);

    // const w = textField.width * backgroundWidthSizeFactor;
    // const h = textField.height * backgroundHeightSizeFactor;
    // const r = 10;

    const backgroundTexture = 'checkBoxOff';
    const backgroundTextureOver = 'checkBoxOff';
    const backgroundTextureDown = 'checkBoxOff';
    const backgroundTextureSelected = 'checkBoxOn';
    const backgroundTextureSelectedOver = 'checkBoxOn';
    const backgroundTextureSelectedDown = 'checkBoxOn';

    const btn = new GameButton(
        eventKeyId,
        eventValue,
        scene,
        0,
        0,
        backgroundTexture,
        backgroundTextureDown,
        backgroundTextureOver,
        'statusPanel',
        backgroundTexture,
        backgroundTextureDown,
        backgroundTextureOver,
        backgroundTextureSelected,
        backgroundTextureSelectedDown,
        backgroundTextureSelectedOver
    );
    btn._addTextLabel(textField);
    for (let i = 0; i < text.length; i++) {
        text[i] = '     ' + text[i];
    }

    textField.setText(text);
    textField.setOrigin(0, 0.5);

    btn.xOffset = -350;

    return btn;
}
