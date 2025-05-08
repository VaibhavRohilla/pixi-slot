import { createNearWinFrame } from '@specific/factory/createNearWinFrame';
import { createMidWinFrames } from '@specific/factory/createMidWinFrame';

export function createGameObjectsBehindSymbols(scene: Phaser.Scene): void {
    //new BorderLights(scene, configReelBorderLights);
    createNearWinFrame(scene);
    createMidWinFrames(scene);
}
