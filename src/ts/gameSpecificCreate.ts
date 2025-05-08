import { initSoundEvents } from './initSoundEvents';

export function gameSpecificCreate(scene: Phaser.Scene): void {
    console.log('GAME SPECIFIC');
    initSoundEvents(scene);
}
