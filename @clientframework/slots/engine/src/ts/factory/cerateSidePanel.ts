import { configSidePanel } from '@specific/config';
import { SidePanel } from '../game-objects/sidePanel';
import ComponentLayer from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/Scenes/ComponentLayer';
import { ISlotDataPresenter } from '../dataPresenter/interfaces';
import { IReelCoordinatesData } from '../dataPresenterVisual/iReelCoordinatesData';
import { globalGetIsPortrait } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/globalGetIsPortrait';

let sidePanel: SidePanel = null;
// let sidePanelW = 0;
// let sidePanelH = 0;
let scene: ComponentLayer = null;

function refreshFromModel(
    slotData: ISlotDataPresenter,
    isFutureData = false
): void {
    isFutureData;

    if (sidePanel && slotData && slotData.scattersPaytable.length > 0) {
        const prizePayTable = slotData.scattersPaytable[1];
        const prizeLevels = [];
        for (let i = prizePayTable.length - 1; i >= 3; i--) {
            prizeLevels.push(prizePayTable[i] * slotData.status.bet);
        }
        sidePanel.updatePrizeLevels(prizeLevels);
    }
}

export function createSidePanel(scene_: ComponentLayer): void {
    scene = scene_;

    if (configSidePanel.data) {
        sidePanel = new SidePanel(scene, configSidePanel);
        sidePanel.setScale(1);

        scene.game.events.on(
            'event-update-sidepanel-dimensions',
            (width: number, height: number) => {
                width;
                height;
                // sidePanelW = width;
                // sidePanelH = height;
                scene.resize();
            }
        );

        //scene.game.events.on("event-reels-scene-coords-data", resizeElements, this);

        scene.game.events.on(
            'event-current-data-updated',
            refreshFromModel,
            this
        );
        scene.game.events.on('event-data', refreshFromModel, this);
        scene.game.events.on(
            'event-future-data-updated',
            (arg) => refreshFromModel(arg, true),
            this
        );

        console.log('event-request-data');
        scene.game.events.emit('event-request-data');
        //scene.game.events.emit("event-request-reels-scene-coords-data");
    }
}

export function resizeSidePanel(data: IReelCoordinatesData): void {
    console.log('sidepanel elements resized pre!!!');
    if (sidePanel && scene) {
        console.log('sidepanel elements resized!!!');

        const deltaYSymbol =
            data.reelsScale *
            (data.symbolsCoords[1][1].y - data.symbolsCoords[1][0].y);
        const reelsH = 3 * deltaYSymbol;
        const middleReelsY = data.reelsCoords[2].y + reelsH / 2;

        const isPort = globalGetIsPortrait(scene);

        if (isPort) {
            sidePanel.setPosition(
                0,
                data.reelsCoords[0].y -
                    configSidePanel.data.size.portrait.height / 2,
                isPort
            );
        } else {
            sidePanel.setPosition(
                data.reelsCoords[0].x -
                    configSidePanel.data.size.landscape.width / 2,
                middleReelsY,
                isPort
            );
        }
        sidePanel.orientationChange();
        sidePanel.repositionElements();
    }
}
