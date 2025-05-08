import GameButton from '../../GameObjects/gameButton';

export function createPopupButtonClassic(
    eventKeyId: string,
    eventValue: number,
    scene: Phaser.Scene,
    text: string
): GameButton {
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
        fontSize: '80px',
        fontFamily: 'Arial',
        align: 'center',
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

    const textField = new Phaser.GameObjects.Text(scene, 0, 0, text, style);
    textField.setOrigin(0.5);

    // const w = textField.width * backgroundWidthSizeFactor;
    // const h = textField.height * backgroundHeightSizeFactor;
    // const r = 10;

    const backgroundTexture = 'emptyNoIdle';
    const backgroundTextureOver = 'emptyNoOver';
    const backgroundTextureDown = 'emptyNoDown';
    const backgroundTextureSelected = 'emptyYesIdle';
    const backgroundTextureSelectedOver = 'emptyYesOver';
    const backgroundTextureSelectedDown = 'emptyYesDown';

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

    return btn;
}
