import { PopupAnimation } from '@clientframework/slots/engine/src/ts/game-objects/PopupAnimation';
import { IReelCoordinatesData } from '@clientframework/slots/engine/src/ts/dataPresenterVisual/iReelCoordinatesData';
import {
    createSidePanel,
    resizeSidePanel,
} from '@clientframework/slots/engine/src/ts/factory/cerateSidePanel';
import ComponentLayer from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/Scenes/ComponentLayer';
import {
    createGameObjectsFreeSpins,
    resizeGameObjectsFreeSpins,
} from './createGameObjectsFreeSpins';
import {
    createGameFeatureHighlights,
    resizeGameFeatureHighlights,
} from './createGameFeatureHighlights';
import { TextPopup } from '@slotsEngine/game-objects/textPopup';
import AnimatedWinLines from '@clientframework/slots/engine/src/ts/game-objects/winLines/animated/animatedWinLines';
import { configAnimatedWinLines, configBorderLights } from '@specific/config';
import { BorderLights } from '@specific/gameObjects/borderLights/borderLights';
import { getFreeSpinsIntroOnReels } from '@clientframework/slots/engine/src/ts/dataPresenter/defaultConfigSlot';
import { createFreeSpinsIntro } from '@specific/factory/createFreeSpinsIntro';

let scene: ComponentLayer = null;

export function createObjectsInFrontOfSymbols(scene_: ComponentLayer): void {
    scene = scene_;

    new AnimatedWinLines(scene, 'winlines', configAnimatedWinLines);

    createSidePanel(scene);

    createGameFeatureHighlights(
        scene,
        'jackPoint',
        true,
        null,
        '',
        'winPopupFont',
        'mainThick'
    );

    createGameObjectsFreeSpins(scene);

    const totalFreespinsWinPopupBackground = new PopupAnimation(
        scene,
        'totalFreespinsWin',
        'totalFreespinsWin',
        0,
        null,
        1
    );
    const backLight = new PopupAnimation(
        scene,
        'backLight',
        'backLight',
        30,
        null,
        1.5 / 0.56
    );
    const totalFreespinsWinPopupAmount = new TextPopup(
        scene,
        'totalFreespinsWinPopupAmount',
        0,
        0,
        true,
        null,
        'winPopupFont',
        ''
    );

    const totalFreespinsWinPopupBorder = new BorderLights(
        scene,
        configBorderLights,
        'totalFreespinsWinPopupBorder',
        false
    );
    totalFreespinsWinPopupBorder.attachReferentObject(
        totalFreespinsWinPopupBackground.sprite,
        15,
        0.03,
        5,
        0.07
    );

    scene.game.events.on(
        'event-count-start-textPopup-totalFreespinsWinPopupAmount',
        () => {
            scene.game.events.emit(
                'event-start-totalFreespinsWinPopupBorder',
                0,
                500
            );
            scene.game.events.emit('event-start-popup-backLight', 0, 500);
        }
    );

    scene.game.events.on('event-stopping-popup-totalFreespinsWin', () => {
        scene.game.events.emit('event-stop-popup-backLight', 0, 500);
        scene.game.events.emit('event-stop-totalFreespinsWinPopupBorder', 500);
    });

    if (getFreeSpinsIntroOnReels()) {
        createFreeSpinsIntro(scene);
    }

    scene.game.events.on(
        'event-reels-scene-coords-data',
        (data: IReelCoordinatesData) => {
            resizeSidePanel(data);

            const middleX: number =
                data.reelsCoords[2].x +
                data.reelsScale * data.symbolsCoords[2][1].x;
            const topY: number =
                data.reelsCoords[2].y +
                data.reelsScale * data.symbolsCoords[2][0].y;
            const bottomY: number =
                data.reelsCoords[2].y +
                data.reelsScale * data.symbolsCoords[2][2].y;
            const middleY: number =
                data.reelsCoords[2].y +
                data.reelsScale * data.symbolsCoords[2][1].y;
            const dY: number =
                data.reelsScale *
                (data.symbolsCoords[2][1].y - data.symbolsCoords[2][0].y);

            totalFreespinsWinPopupBackground.setPosition(
                middleX,
                middleY - 0.25 * dY
            );
            totalFreespinsWinPopupBackground.setScale(data.reelsScale);
            totalFreespinsWinPopupBorder.resize();

            backLight.setPosition(middleX, middleY - 0.25 * dY);
            backLight.setScale(data.reelsScale);

            totalFreespinsWinPopupAmount.setTextPosition(
                middleX,
                middleY - 0.25 * dY,
                data.reelsScale * 0.75
            );

            const deltaXReels = data.reelsCoords[1].x - data.reelsCoords[0].x;
            const bottomScreenY =
                scene.scale.gameSize.height / data.camera.zoom;
            const reelsW = 5 * deltaXReels;
            const fieldY = bottomY + 0.2 * (bottomScreenY - bottomY);
            resizeGameObjectsFreeSpins(data, fieldY, reelsW, middleX, bottomY);
            resizeGameFeatureHighlights(data, topY, reelsW, middleX, bottomY);
        }
    );
}
