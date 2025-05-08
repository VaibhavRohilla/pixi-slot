import { IPointData } from './iPointData';

export interface IReelCoordinatesData {
    reelsScale: number;
    reelsCoords: IPointData[];
    symbolsCoords: IPointData[][];
    camera: {
        zoom: number;
        scrollX: number;
        scrollY: number;
        originX: number;
        originY: number;
    };
    logo: {
        x: number;
        y: number;
        w: number;
        h: number;
        scale: number;
    };
    bg: {
        x: number;
        y: number;
        w: number;
        h: number;
        scale: number;
    };
}

export function syncCameraWithReelsCoordinatesData(
    scene,
    data: IReelCoordinatesData
): void {
    console.log('ON event-reels-scene-coords-data', data);
    scene.cameras.main.setZoom(data.camera.zoom);
    scene.cameras.main.setOrigin(data.camera.originX, data.camera.originY);
    scene.cameras.main.setScroll(data.camera.scrollX, data.camera.scrollY);
}
