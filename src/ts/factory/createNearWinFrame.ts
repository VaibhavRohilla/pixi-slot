import { PopupAnimation } from '@clientframework/slots/engine/src/ts/game-objects/PopupAnimation';
import { IReelCoordinatesData } from '@clientframework/slots/engine/src/ts/dataPresenterVisual/iReelCoordinatesData';
import { reelWinBgResize } from './reelWinBgResize';
import { globalGetIsPortrait } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/globalGetIsPortrait';

let scene: Phaser.Scene;

export function createNearWinFrame(scene_: Phaser.Scene): void {
    scene = scene_;

    let nearWinFrameIndex = 0;
    const nearWinFrame = new PopupAnimation(
        scene,
        'nearWinFrame',
        'nearWinFrame',
        30,
        null,
        2.2
    );
    const nearWinFrameBg = new PopupAnimation(
        scene,
        'nearWinFrameBg',
        'reelBehind',
        0,
        null
    );
    nearWinFrameBg.sprite.setDepth(1);
    scene.game.events.on(
        'event-near-win-prolong-started',
        (reelIndex: number) => {
            nearWinFrameIndex = reelIndex;
            nearWinFrame.startAnim(0);
            nearWinFrameBg.startAnim(0);
            scene.game.events.emit('event-request-reels-scene-coords-data');
            //this.resize();
        },
        scene
    );

    scene.game.events.on(
        'event-near-win-prolong-stopped',
        (reelIndex: number) => {
            reelIndex;
            nearWinFrame.fadeOutAndStop();
            nearWinFrameBg.fadeOutAndStop();
        },
        scene
    );

    scene.game.events.on(
        'event-reel-spin-completed',
        (reelIndex: number) => {
            if (reelIndex == nearWinFrameIndex) {
                nearWinFrame.fadeOutAndStop();
                nearWinFrameBg.fadeOutAndStop();
            }
        },
        scene
    );

    scene.game.events.on(
        'event-animation-rotation-end',
        () => {
            nearWinFrame.fadeOutAndStop();
            nearWinFrameBg.fadeOutAndStop();
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
            reelWinBgResize(
                nearWinFrame,
                data.reelsScale *  (isPort ? 2.4 : 2.2),
                data.reelsCoords[nearWinFrameIndex].x +
                    (isPort ? 0.42 : 0.48) * deltaXReels,
                data.reelsCoords[nearWinFrameIndex].y +
                    (isPort ? 1.5 : 1.505) * deltaYSymbol,
                globalGetIsPortrait(scene)
            );

            reelWinBgResize(
                nearWinFrameBg,
                data.reelsScale*  (isPort ? 1.17 : 1),
                data.reelsCoords[nearWinFrameIndex].x +
                    (isPort ? 0.455 : 0.48) * deltaXReels,
                data.reelsCoords[nearWinFrameIndex].y + 1.5 * deltaYSymbol,
                globalGetIsPortrait(scene)
            );
        },
        scene
    );
}
