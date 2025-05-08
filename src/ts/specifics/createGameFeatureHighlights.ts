import { IReelCoordinatesData } from '@clientframework/slots/engine/src/ts/dataPresenterVisual/iReelCoordinatesData';
import _sortBy from 'lodash-es/sortBy';
import { TextPopup } from '@clientframework/slots/engine/src/ts/game-objects/textPopup';
import { globalGetIsPortrait } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/globalGetIsPortrait';
import { getLanguageTextGameMsg } from '@clientframework/common/backend-service/src/client-remote-data/src/multilanguage/gameMsgData';
import { GameMsgKeys } from '@clientframework/common/backend-service/src/client-remote-data/src/multilanguage/gameMsgKeys';


let scene_: Phaser.Scene;

let spriteHasPortrait_: boolean;
let spriteTextureKey_: string;

let textBelowReels: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text;
let totalWin: TextPopup;
// let textAboveReels: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text;

let lastData;

function orientationChange(): void {
    //
}

export function resizeGameFeatureHighlights(
    data: IReelCoordinatesData,
    topY: number,
    reelsW: number,
    middleReelsX: number,
    reelsBottom: number
): void {
    // console.log(this.sceneKey + ' orientationChange');
    lastData = { data, topY, reelsW, middleReelsX, reelsBottom };
    orientationChange();

    const deltaXReels = data.reelsCoords[1].x - data.reelsCoords[0].x;
    // const dY: number =
    //     data.reelsScale *
    //     (data.symbolsCoords[2][1].y - data.symbolsCoords[2][0].y);
    // const bottomY = scene_.scale.gameSize.height / scene_.cameras.main.zoom;
    // let totalWinX;

    if (globalGetIsPortrait(scene_)) {
        const bottomTextOffsetY = 100;
        const spriteOffsetY = 50;
        const bottomTextOffsetX = 0;

        const xx = data.reelsScale * data.reelsCoords[2].x + deltaXReels * 0.5;
        const yy = reelsBottom + spriteOffsetY;

        textBelowReels.setOrigin(0.5, 0.5);
        textBelowReels.setPosition(
            xx + bottomTextOffsetX,
            yy + bottomTextOffsetY
        );

        totalWin.setTextPosition(
            middleReelsX,
            data.reelsCoords[0].y + (globalGetIsPortrait(scene_) ? 35 : 35)
        );
        totalWin.setScale(0.75);
    } else {
        const bottomTextOffsetY = 123;
        const spriteOffsetY = 0;
        const bottomTextOffsetX = 0;

        const xx = data.reelsScale * data.reelsCoords[2].x + deltaXReels * 0.5;
        const yy = reelsBottom + spriteOffsetY;

        textBelowReels.setOrigin(0.5, 0.5);
        textBelowReels.setPosition(
            xx + bottomTextOffsetX,
            yy + bottomTextOffsetY
        );
        textBelowReels.setScale(0.8)

        totalWin.setTextPosition(
            middleReelsX + 400,
            data.reelsCoords[0].y - 75
        );
        totalWin.setScale(0.5);
    }

    // let offsetY = -35;
    // textAboveReels.setOrigin(1, 1);
    // textAboveReels.setPosition(middleReelsX + deltaXReels * 2.5, topY - dY / 2 + offsetY);
}

function generateSpriteFrames(
    port: boolean
): Phaser.Types.Animations.AnimationFrame[] {
    // frames should go from 0 to end, then back to 0
    const key = spriteTextureKey_ + (port ? '-portrait' : '');
    let frameNames = scene_.anims.generateFrameNames(key);
    frameNames = _sortBy(frameNames, ['frame']);

    const additionalFrames: Phaser.Types.Animations.AnimationFrame[] = [];
    for (let i = frameNames.length - 2; i >= 0; i--) {
        additionalFrames.push(frameNames[i]);
    }
    frameNames.push(...additionalFrames);
    return frameNames;
}

export function createGameFeatureHighlights(
    scene: Phaser.Scene,
    spriteTextureKey: string,
    spriteHasPortrait: boolean,
    style?: any,
    bitmapFontTextureKey?: string,
    bitmapFontTextureKeySuffixThin?: string,
    bitmapFontTextureKeySuffixThick?: string
): void {
    scene_ = scene;
    spriteTextureKey_ = spriteTextureKey;
    spriteHasPortrait_ = spriteHasPortrait;

    const bottomText = getLanguageTextGameMsg(
        GameMsgKeys.winUpToNSpins
    ).toUpperCase();
    // let topText = ("20 lines").toUpperCase();

    if (bitmapFontTextureKeySuffixThick && bitmapFontTextureKeySuffixThin) {
        // this.prizeLevelTexts[i] = scene.add.bitmapText(0, 0, bitmapFontTextureKey, "", this.config.bitmapTextCfg.size);
        textBelowReels = scene_.add.bitmapText(
            0,
            0,
            bitmapFontTextureKey + bitmapFontTextureKeySuffixThick,
            '',
            50
        );
        totalWin = new TextPopup(
            scene_,
            'totalWin',
            0,
            0,
            true,
            null,
            bitmapFontTextureKey + bitmapFontTextureKeySuffixThick,
            ''
        );

        // textAboveReels = scene_.add.bitmapText(0, 0, bitmapFontFullKey, "", 35);
    } else {
        let defaultStyle = false;
        if (!style) {
            defaultStyle = true;
            style = {
                font: '200px Arial',
                align: 'center',
                color: '#ff0',
                stroke: '#000',
                strokeThickness: 16,
            };
        }
        textBelowReels = scene_.add.text(0, 200, '', style);
        totalWin = new TextPopup(scene_, 'totalWin', 0, 0, true, style);
        // textAboveReels = scene.add.text(0, 300, "", style);

        if (defaultStyle) {
            textBelowReels.setShadow(2, 2, '#333333', 2, true, true);
            textBelowReels.setTint(0xffff00, 0xffaa00, 0xffaa00, 0xffff00);
            // textAboveReels.setShadow(2, 2, "#333333", 2, true, true);
            textBelowReels.setTint(0xffff00, 0xffaa00, 0xffaa00, 0xffff00);
        }
    }
    textBelowReels.setText(bottomText);
    totalWin.setText('0.00');
    // textAboveReels.setText(topText);

    const landscapeFrames = generateSpriteFrames(false);
    scene_.anims.create({
        key: spriteTextureKey_,
        frames: landscapeFrames,
        repeat: -1,
        frameRate: 30,
    });

    if (spriteHasPortrait_) {
        const portraitFrames = generateSpriteFrames(true);
        scene_.anims.create({
            key: spriteTextureKey_ + '-portrait',
            frames: portraitFrames,
            repeat: -1,
            frameRate: 30,
        });
    }

    scene_.game.events.on(
        'event-stopped-popup-bonusPopup',
        () => {
            const trg = [textBelowReels];
            scene_.add.tween({
                targets: trg,
                duration: 200,
                alpha: 0,
                ease: 'Linear',
                onComplete: () => {
                    trg.forEach((element) => {
                        element.setActive(false).setVisible(false).setAlpha(1);
                    });
                },
            });
        },
        this
    );

    scene_.game.events.on(
        'event-freespins-fade-graphics',
        () => {
            const trg = [textBelowReels];
            trg.forEach((element) => {
                element.setActive(true).setVisible(true).setAlpha(0);
            });

            scene_.add.tween({
                targets: trg,
                duration: 200,
                alpha: 1,
                ease: 'Linear',
            });

            resizeGameFeatureHighlights(
                lastData.data,
                lastData.topY,
                lastData.reelsW,
                lastData.middleReelsX,
                lastData.reelsBottom
            );
        },
        this
    );

    scene_.game.events.on(
        'event-animation-bonusEnd-start',
        () => {
            scene_.game.events.emit('event-stop-textPopup-totalWin');
        },
        this
    );
}
