import ComponentLayer from '@commonEngine/Scenes/ComponentLayer';
import {
    IReelCoordinatesData,
    syncCameraWithReelsCoordinatesData,
} from '../dataPresenterVisual/iReelCoordinatesData';
import { TextPopup } from '../game-objects/textPopup';
import { ParticleWinAnimation } from '../game-objects/particles/particleWinAnimation';

import {
    configParticleWinAnimation,
    configAnimationWin,
    configWinPopupAnimation,
} from '@specific/config';
import { createObjectsInFrontOfSymbols } from '@specific/specifics/createObjectsInFrontOfSymbols';
import {
    WinPopupAnimation,
    WinAnimationType,
} from '../game-objects/WinPopupAnimation';
import { globalGetIsPortrait } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/globalGetIsPortrait';
import { PopupAnimation } from '../game-objects/PopupAnimation';
import {
    getReelOverlayConfig,
    getWinPopupRelativeParameters,
    updateWinLinesScene,
} from '../dataPresenter/defaultConfigSlot';

export interface ITextPopupScaleConfig {
    alternateScaleFactor: number;
    additionalScaleFactor: number;
}

let lineWinAmountPopupConfig: ITextPopupScaleConfig = {
    alternateScaleFactor: 1,
    additionalScaleFactor: 1,
};

export function setLineWinAmountPopupConfig(
    newOne: ITextPopupScaleConfig
): void {
    lineWinAmountPopupConfig = newOne;
}

export default class WinLines extends ComponentLayer {
    constructor() {
        super({
            key: 'WinLines',
        });
    }

    create(): void {
        createObjectsInFrontOfSymbols(this);

        let winTextBacklight: PopupAnimation;
        if (configAnimationWin.winTextHasBackLight) {
            winTextBacklight = new PopupAnimation(
                this,
                'winBackLight',
                'backLight',
                30,
                null,
                1.5 / 0.56
            );
        }

        const winPopupRelativeParameters = getWinPopupRelativeParameters();

        let reelOverlayBig: PopupAnimation;
        let reelOverlaySmall: PopupAnimation;
        if (getReelOverlayConfig()) {
            reelOverlayBig = new PopupAnimation(
                this,
                getReelOverlayConfig().textureKey,
                getReelOverlayConfig().textureKey,
                0
            );
            if (getReelOverlayConfig().smallTextureKey) {
                reelOverlaySmall = new PopupAnimation(
                    this,
                    getReelOverlayConfig().smallTextureKey,
                    getReelOverlayConfig().smallTextureKey,
                    0
                );
            }
            this.game.events.on('event-stop-popup-reeloverlay-any', () => {
                this.game.events.emit(
                    `event-stop-popup-${getReelOverlayConfig().textureKey}`
                );
                if (getReelOverlayConfig().smallTextureKey) {
                    this.game.events.emit(
                        `event-stop-popup-${
                            getReelOverlayConfig().smallTextureKey
                        }`
                    );
                }
            });
        }

        const lineWinAmountPopup = new TextPopup(
            this,
            'lineWin',
            0,
            0,
            true,
            null,
            'winPopupFont',
            '',
            lineWinAmountPopupConfig.alternateScaleFactor,
            lineWinAmountPopupConfig.additionalScaleFactor
        );
        let singleLineWinAmountPopup;
        if (configAnimationWin.showNearLineAmounts) {
            singleLineWinAmountPopup = new TextPopup(
                this,
                'singleLineWin',
                0,
                0,
                true,
                null,
                'winPopupFont',
                ''
            );
        }

        const lineWinCoins = new ParticleWinAnimation(
            this,
            'lineWinCoins',
            'coin',
            configParticleWinAnimation
        );

        const winPopupAnimations: WinPopupAnimation[] = [];
        if (configWinPopupAnimation.shouldDo) {
            if (configWinPopupAnimation.levels) {
                configWinPopupAnimation.levels.forEach((level) => {
                    const winPopupAnimation = new WinPopupAnimation(
                        this,
                        level.key,
                        level.key,
                        configWinPopupAnimation
                    );
                    winPopupAnimations.push(winPopupAnimation);
                });
            } else {
                const winPopupAnimation = new WinPopupAnimation(
                    this,
                    'winA',
                    WinAnimationType.win,
                    configWinPopupAnimation
                );
                winPopupAnimations.push(winPopupAnimation);
            }
        }

        this.game.events.on(
            'event-reels-scene-coords-data',
            (data: IReelCoordinatesData) => {
                syncCameraWithReelsCoordinatesData(this, data);

                const middleX: number =
                    data.reelsCoords[2].x +
                    data.reelsScale * data.symbolsCoords[2][1].x;
                const middleY: number =
                    data.reelsCoords[2].y +
                    data.reelsScale * data.symbolsCoords[2][1].y;

                const winPopupY: number =
                    data.reelsCoords[2].y +
                    data.reelsScale *
                        winPopupRelativeParameters.relativeFactorY *
                        (data.symbolsCoords[2][
                            winPopupRelativeParameters.startRow
                        ].y +
                            (winPopupRelativeParameters.endRow == -100
                                ? 0
                                : data.symbolsCoords[2][
                                      winPopupRelativeParameters.endRow
                                  ].y));

                const dY: number =
                    data.reelsScale *
                    (data.symbolsCoords[2][1].y - data.symbolsCoords[2][0].y);

                if (configAnimationWin.winStaysConstantlyInFreeSpins) {
                    lineWinAmountPopup.setTextPosition(
                        middleX,
                        configAnimationWin.winTextForcedY
                            ? configAnimationWin.winTextForcedY(data)
                            : data.reelsCoords[0].y -
                                  (globalGetIsPortrait(this) ? 100 : 130)
                    );
                    lineWinAmountPopup.setScale(
                        0.5 *
                            (configAnimationWin.lineWinTextScaleFactor
                                ? configAnimationWin.lineWinTextScaleFactor
                                : 1)
                    );
                } else {
                    lineWinAmountPopup.setTextPosition(
                        middleX,
                        configAnimationWin.winTextForcedY
                            ? configAnimationWin.winTextForcedY(data)
                            : middleY - 0.25 * dY,
                        configAnimationWin.lineWinTextScaleFactor
                            ? configAnimationWin.lineWinTextScaleFactor
                            : data.reelsScale
                    );
                }

                if (singleLineWinAmountPopup) {
                    singleLineWinAmountPopup.setTextPosition(
                        middleX,
                        middleY - 0.25 * dY,
                        data.reelsScale
                    );
                    singleLineWinAmountPopup.setScale(0.5);
                }

                if (winPopupAnimations && winPopupAnimations.length > 0) {
                    winPopupAnimations.forEach((winPopupAnimation) => {
                        winPopupAnimation.setPosition(middleX, winPopupY);
                        winPopupAnimation.setScale(data.reelsScale);
                    });
                }
                winTextBacklight &&
                    winTextBacklight.setPosition(
                        lineWinAmountPopup.x,
                        lineWinAmountPopup.y
                    );

                if (reelOverlayBig) {
                    reelOverlayBig.setPosition(middleX, middleY);
                    reelOverlayBig.setScale(data.reelsScale * 0.77);
                }
                if (reelOverlaySmall) {
                    reelOverlaySmall.setPosition(middleX, middleY);
                    reelOverlaySmall.setScale(data.reelsScale * 0.77);
                }

                const middleYCoins: number =
                    data.reelsCoords[2].y +
                    data.reelsScale * data.symbolsCoords[2][0].y;

                lineWinCoins.setEmitterPosition(middleX, middleYCoins);
            }
        );
        this.game.events.emit('event-request-reels-scene-coords-data');

        //this.game.events.emit("event-start-bigwin-lineWinCoins", WinAnimationType.win);

        // this.game.events.emit("event-show-additional-line", 9, 500);

        // setTimeout(() => this.game.events.emit("event-show-additional-line", 12, 500), 2000);
        // setTimeout(() => this.game.events.emit("event-show-additional-line", 1, 500), 4000);
        // setTimeout(() => this.game.events.emit("event-show-additional-line", 2, 500), 6000);
        // setTimeout(() => this.game.events.emit("event-show-additional-line", 3, 500), 8000);
        // setTimeout(() => this.game.events.emit("event-show-additional-line", 4, 500), 10000);
        // setTimeout(() => this.game.events.emit("event-show-additional-line", 5, 500), 12000);
        // setTimeout(() => this.game.events.emit("event-show-single-line", 1, 500), 14000);
        // setTimeout(() => this.game.events.emit("event-show-reels-frame", 1000), 3000);
    }

    update(): void {
        updateWinLinesScene();
    }
}
