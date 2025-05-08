import { generateRoundedRectTexture } from '../GameObjects/helpers/generateRoundedRectTexture';

export function generatePopupBackgroundTexture(scene: Phaser.Scene): string {
    const textureKey = 'popupBackground';
    return generateRoundedRectTexture(
        scene,
        textureKey,
        1820,
        980,
        120,
        0x000000,
        0x000000,
        0.65
    );
}
