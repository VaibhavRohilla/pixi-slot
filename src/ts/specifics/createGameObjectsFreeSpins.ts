import { IReelCoordinatesData } from '@clientframework/slots/engine/src/ts/dataPresenterVisual/iReelCoordinatesData';
import {
    createGameObjectFreeSpinsJacks,
    resizeElementsGameObjectFreeSpinsJacks,
} from '@clientframework/slots/engine/src/ts/factory/jack/createGameObjectsFreeSpinsJacks';

export function createGameObjectsFreeSpins(scene: Phaser.Scene): void {
    createGameObjectFreeSpinsJacks(scene, null, 'main', 'Thin', 'Thick');
}

export function resizeGameObjectsFreeSpins(
    data: IReelCoordinatesData,
    fieldY: number,
    reelsW: number,
    middleReelsX: number,
    reelsBottom: number
): void {
    resizeElementsGameObjectFreeSpinsJacks(
        data,
        fieldY,
        reelsW,
        middleReelsX,
        reelsBottom
    );
}
