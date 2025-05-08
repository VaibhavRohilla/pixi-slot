import { PopupAnimation } from '@clientframework/slots/engine/src/ts/game-objects/PopupAnimation';
import { IReelCoordinatesData } from '@clientframework/slots/engine/src/ts/dataPresenterVisual/iReelCoordinatesData';
import { reelWinBgResize } from './reelWinBgResize';
import { slotDataPresenter } from '@clientframework/slots/engine/src/ts/dataPresenter/instances';
import { globalGetIsPortrait } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/globalGetIsPortrait';

let scene: Phaser.Scene;

export function createMidWinFrames(scene_: Phaser.Scene): void {
    scene = scene_;

    const bgs: {
        behind: PopupAnimation;
        front: PopupAnimation;
        top: PopupAnimation;
        bottom: PopupAnimation;
    }[] = [];

    const pulseDuration = 1000;

    for (let i = 0; i < slotDataPresenter.reels.reelsNum; i++) {
        bgs.push({
            behind: new PopupAnimation(scene, 'bgs', 'reelBehind', 0, null),
            front: new PopupAnimation(scene, 'bgs', 'reelFront', 0, null, 1),
            top: new PopupAnimation(
                scene,
                'bgs-top',
                'midWinAnim',
                30,
                null,
                2
            ),
            bottom: new PopupAnimation(scene, 'bgs', 'midWinAnim', 30, null, 2),
        });
        bgs[i].behind.sprite.setDepth(1);
        bgs[0].top.shouldEmitRepeatEvents(true);

        // bgs[i].behind.setShouldPulsing(true, pulseDuration);
        // bgs[i].front.setShouldPulsing(true, pulseDuration);
        //bgs[i].top.setShouldPulsing(true,pulseDuration);
        //bgs[i].bottom.setShouldPulsing(true, pulseDuration)
    }

    scene.game.events.on(
        'animationrepeat-bgs-top',
        () => {
            for (let i = 0; i < bgs.length; i++) {
                bgs[i].front.startPulsing(0, 1 * pulseDuration);
                bgs[i].behind.startPulsing(0, 1 * pulseDuration);
            }
        },
        scene
    );

    scene.game.events.on(
        'event-start-lightsFrame',
        () => {
            for (let i = 0; i < bgs.length; i++) {
                bgs[i].front.startAnim(0);
                bgs[i].behind.startAnim(0);
                bgs[i].top.startAnim(0);
                bgs[i].bottom.startAnim(0);
            }
            scene.game.events.emit('event-request-reels-scene-coords-data');
            //this.resize();
        },
        scene
    );

    scene.game.events.on(
        'event-stop-lightsFrame',
        () => {
            for (let i = 0; i < bgs.length; i++) {
                bgs[i].front.fadeOutAndStop();
                bgs[i].behind.fadeOutAndStop();
                bgs[i].top.fadeOutAndStop();
                bgs[i].bottom.fadeOutAndStop();
            }
        },
        scene
    );

    scene.game.events.on(
        'event-reels-scene-coords-data',
        (data: IReelCoordinatesData) => {
            const deltaXReels = data.reelsCoords[1].x - data.reelsCoords[0].x;
            const deltaYSymbol =
                data.reelsScale *
                (data.symbolsCoords[0][1].y - data.symbolsCoords[0][0].y);

            const isPort = globalGetIsPortrait(scene);
            for (let i = 0; i < bgs.length; i++) {
                reelWinBgResize(
                    bgs[i].behind,
                    data.reelsScale,
                    data.reelsCoords[i].x +
                        (isPort ? 0.455 : 0.485) * deltaXReels,
                    data.reelsCoords[i].y +
                        (isPort ? 1.5 : 1.495) * deltaYSymbol,
                    isPort
                );
                bgs[i].behind.setScale(
                    data.reelsScale,
                    isPort ? 0.94 : 1.2,
                    isPort ? 1.15 : 1.15
                );
                bgs[i].front.setOrigin(isPort ? 0.45 : 0.5, 0.5);
                bgs[i].front.setScale(
                    data.reelsScale,
                    isPort ? 0.94 : 1.2,
                    isPort ? 1.15 : 1.15
                );
                bgs[i].front.setPosition(
                    data.reelsCoords[i].x +
                        (isPort ? 0.444 : 0.479) * deltaXReels,
                    data.reelsCoords[i].y + 1.5 * deltaYSymbol
                );

                bgs[i].top.setOrigin(0.5, 0.5);
                bgs[i].top.setScale(data.reelsScale);
                bgs[i].top.setPosition(
                    data.reelsCoords[i].x + (isPort ? 0.55 : 0.49) * deltaXReels,
                    data.reelsCoords[i].y + -0.08 * deltaYSymbol
                );

                bgs[i].bottom.setOrigin(0.5, 0.5);
                bgs[i].bottom.setScale(data.reelsScale);
                bgs[i].bottom.setPosition(
                    data.reelsCoords[i].x + (isPort ? 0.55 : 0.5) * deltaXReels,
                    data.reelsCoords[i].y + 3 * deltaYSymbol
                );
            }
        },
        scene
    );
}
