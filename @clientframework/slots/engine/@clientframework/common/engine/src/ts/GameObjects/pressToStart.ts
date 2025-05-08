import { globalGetIsPortrait } from '../globalGetIsPortrait';
import { getLanguageTextGameMsg } from '@clientframework/common/backend-service/src/client-remote-data/src/multilanguage/gameMsgData';
import { GameMsgKeys } from '@clientframework/common/backend-service/src/client-remote-data/src/multilanguage/gameMsgKeys';

let scene: Phaser.Scene;
let pressToStart: Phaser.GameObjects.Text;
let clickText: string;

function pressedToStartClicked(): void {
    pressToStart && pressToStart.destroy();
    pressToStart = null;
    console.log('pressedToStartClicked()');
    scene.game.events.emit('event-loading-complete-scene-clicked');
}

export function resizePressToStartAnimation(
    scene: Phaser.Scene,
    scale: number,
    offsetY,
    offsetScale,
    pressToStartFontSize,
    forcedX?: number,
    forcedY?: number
): void {
    const xx = forcedX !== undefined ? forcedX : scene.scale.gameSize.width / 2; //Number(this.game.config.width) / 2;
    const yy =
        forcedY !== undefined
            ? forcedY
            : scene.scale.gameSize.height / 2 + offsetY; //Number(this.game.config.height) / 2;

    const presToStartScale = Math.abs(scale + offsetScale);

    pressToStart &&
        pressToStart.setPosition(xx, yy) &&
        pressToStart.setScale(presToStartScale);

    if (pressToStart && pressToStartFontSize) {
        pressToStart.style.setStroke(
            pressToStartFontSize.stroke,
            pressToStartFontSize.strokeThickness
        );
        if (navigator.userAgent.includes('Mobile')) {
            globalGetIsPortrait(scene)
                ? pressToStart.style.setFontSize(
                      pressToStartFontSize.mobilePort
                  )
                : pressToStart.style.setFontSize(
                      pressToStartFontSize.mobileLand
                  );
        } else {
            globalGetIsPortrait(scene)
                ? pressToStart.style.setFontSize(
                      pressToStartFontSize.desktopPort
                  )
                : pressToStart.style.setFontSize(
                      pressToStartFontSize.desktopLand
                  );
        }
    }
}

export function createPressToStartAnimation(scene_: Phaser.Scene): void {
    console.log('createPressToStartAnimation');
    scene = scene_;

    const xx = scene.scale.gameSize.width / 2; //Number(this.game.config.width) / 2;
    const yy = scene.scale.gameSize.height / 2; //Number(this.game.config.height) / 2;

    if (navigator.userAgent.indexOf('Mobile') != -1) {
        clickText = getLanguageTextGameMsg(GameMsgKeys.tapToPlay);
    } else {
        clickText = getLanguageTextGameMsg(GameMsgKeys.clickToPlay);
    }

    scene.input.on('pointerup', () => {
        pressedToStartClicked();
    });

    pressToStart = scene.add.text(xx, yy, clickText, {
        fontFamily: 'Arial',
        fontSize: '65px',
        fontStyle: 'bold',
    });
    pressToStart.setScale(1, 1);
    pressToStart.setOrigin(0.5, 0.5);
    scene.tweens.add({
        targets: pressToStart,
        duration: 600,
        repeat: -1,
        yoyo: true,
        alpha: {
            from: 0.8,
            to: 0.2,
        },
    });
}
