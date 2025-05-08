import { PopupAnimation } from '@clientframework/slots/engine/src/ts/game-objects/PopupAnimation';

export function reelWinBgResize(
    popup: PopupAnimation,
    reelsScale: number,
    x: number,
    y: number,
    isPortrait: boolean
): void {
    popup.setOrigin(isPortrait ? 0.44 : 0.5, isPortrait ? 0.51 : 0.5);
    popup.setScale(reelsScale, isPortrait ? 0.94 : 1.09, isPortrait ? 0.99 : 1.18);
    popup.setPosition(x, y);
}
