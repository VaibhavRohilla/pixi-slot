import GameButton from "@clientframework/slots/engine/@clientframework/common/engine/src/ts/GameObjects/gameButton";

export function createPopupButtonFlamingHotJoker(
    eventKeyId: string,
    eventValue: number,
    scene: Phaser.Scene,
    text: string
): GameButton {
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
        fontSize: '45px',
        fontFamily: 'myriadForJack',
        align: 'left',
        color: '#fef800',
        // stroke: '#000',
        // strokeThickness: 5,
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

    const backgroundTexture = 'BetField';
    const backgroundTextureOver = 'BetField';
    const backgroundTextureDown = 'BetField-selected';
    const backgroundTextureSelected = 'BetField-selected';
    const backgroundTextureSelectedOver = 'BetField-selected';
    const backgroundTextureSelectedDown = 'BetField-selected';

    const btn = new GameButton(
        eventKeyId,
        eventValue,
        scene,
        0,
        0,
        backgroundTexture,
        backgroundTextureDown,
        backgroundTextureOver,
        'uiPanel',
        backgroundTexture,
        backgroundTextureDown,
        backgroundTextureOver,
        backgroundTextureSelected,
        backgroundTextureSelectedDown,
        backgroundTextureSelectedOver
    );
    btn._addTextLabel(textField);

    btn.backgroundScaleFactorW = 1;
    btn.backgroundScaleFactorH = 1;

    return btn;
}
