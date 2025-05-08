import { IPointData } from '@clientframework/slots/engine/src/ts/dataPresenterVisual/iPointData';
import { IConfigWinLinesSegments } from '@clientframework/slots/engine/src/ts/game-objects/winLines/segmented/winLinesSegments';
import {
    IConfigWinPopupAnimation,
    IWinFramesConfig,
} from '@clientframework/slots/engine/src/ts/game-objects/WinPopupAnimation';
import _sortBy from 'lodash-es/sortBy';
import { IConfigAnimationWin } from '@clientframework/slots/engine/src/ts/gameFlow/complexAnimations/animationWin/animationWin';
import {
    IConfigSceneReels,
    IAnimatedLogoCfg,
} from '@clientframework/slots/engine/src/ts/scenes/Reels';
import Reel from '@clientframework/slots/engine/src/ts/game-objects/Reel';
import { IConfigParticleWinAnimation } from '@clientframework/slots/engine/src/ts/game-objects/particles/particleWinAnimation';
import { IConfigAnimatedWinLines } from '@clientframework/slots/engine/src/ts/game-objects/winLines/animated/animatedWinLines';
import { IConfigSidePanel } from '@clientframework/slots/engine/src/ts/game-objects/sidePanel';
import { IConfigBorderLights } from './gameObjects/borderLights/borderLights';
import { createCheckBoxJack } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/factory/jack/createCheckBoxJack';
import { createPopupButtonJack } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/factory/jack/createPopupButtonJack';
import { basePopupStyleJack } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/factory/jack/basePopupStyleJack';
import { createOverlaysJack } from '@clientframework/slots/engine/src/ts/factory/jack/createOverlaysJack';
import { IReelCoordinatesData } from '@clientframework/slots/engine/src/ts/dataPresenterVisual/iReelCoordinatesData';
import { getQueryParams } from '@clientframework/common/backend-service/src/launchParams/getQueryParams';
import {
    setAnimateBacklightInsteadOfLogo,
    setFreeSpinsIntroOnReels,
    setPreloadHasFadeInShadow,
    setPreloadStartBackgroundAnimations,
} from '@clientframework/slots/engine/src/ts/dataPresenter/defaultConfigSlot';
import { createPressToStartAnimation } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/GameObjects/pressToStart';
import { createOverlaysFlamingHotJoker } from '@clientframework/slots/engine/src/ts/factory/flaminghotjoker/createOverlaysFlamingHotJoker';
import { createPopupButtonFlamingHotJoker } from '@clientframework/slots/engine/src/ts/factory/flaminghotjoker/createPopupButtonFlamingHotJoker';

export const reelSymbolConfig: IPointData = { x: 280, y: 250 };

export const configWinlinesSegments: IConfigWinLinesSegments = {
    winlineSegmentConfig: {
        x: 0,
        y: 0,
        textureKey: 'lightsForFrame',
        textureScale: 1,
        textureEffectiveWidth: 1,
        textureAnchor: { x: 0.5, y: 0.5 },
        frameTemplate: {
            key: 'lightsForFrame',
            config: (i): any => {
                i;
                return {
                    start: 0,
                    end: 72,
                    zeroPad: 5,
                    prefix: 'Light For Frame_',
                };
            },
        },
        animsNum: 0,
    },
};

export const configBorderLights: IConfigBorderLights = {
    configWinlineSegment: configWinlinesSegments.winlineSegmentConfig,
};

export const configReelBorderLights: IConfigBorderLights = {
    configWinlineSegment: configBorderLights.configWinlineSegment,

    segmentsData: [
        // these coordinates specify the position of border segments
        // all values that are not divisible to 0.5 e.g. 2.6, 0.6, 0.55 - are moved to cover the border of the slot, as opposed to representing the edge of the reel

        // left border
        [
            [-0.5, 0],
            [0, 0],
        ],
        [
            [-0.5, 0.5],
            [0, 0],
        ],
        [
            [-0.5, 1],
            [0, 0],
        ],
        [
            [-0.5, 1.5],
            [0, 0],
        ],
        [
            [-0.5, 2],
            [0, 0],
        ],

        // right border
        [
            [4.5, 0],
            [0, 0],
        ],
        [
            [4.5, 0.5],
            [0, 0],
        ],
        [
            [4.5, 1],
            [0, 0],
        ],
        [
            [4.5, 1.5],
            [0, 0],
        ],
        [
            [4.5, 2],
            [0, 0],
        ],

        // top border
        [
            [-0.5, -0.5],
            [0, 0],
        ],
        [
            [0, -0.5],
            [0, 0],
        ],
        [
            [0.5, -0.5],
            [0, 0],
        ],
        [
            [1, -0.5],
            [0, 0],
        ],
        [
            [1.5, -0.5],
            [0, 0],
        ],
        [
            [2, -0.5],
            [0, 0],
        ],
        [
            [2.5, -0.5],
            [0, 0],
        ],
        [
            [3, -0.5],
            [0, 0],
        ],
        [
            [3.5, -0.5],
            [0, 0],
        ],
        [
            [4, -0.5],
            [0, 0],
        ],
        [
            [4.5, -0.5],
            [0, 0],
        ],

        // bottom border
        [
            [-0.5, 2.5],
            [0, 0],
        ],
        [
            [0, 2.5],
            [0, 0],
        ],
        [
            [0.5, 2.5],
            [0, 0],
        ],
        [
            [1, 2.5],
            [0, 0],
        ],
        [
            [1.5, 2.5],
            [0, 0],
        ],
        [
            [2, 2.5],
            [0, 0],
        ],
        [
            [2.5, 2.5],
            [0, 0],
        ],
        [
            [3, 2.5],
            [0, 0],
        ],
        [
            [3.5, 2.5],
            [0, 0],
        ],
        [
            [4, 2.5],
            [0, 0],
        ],
        [
            [4.5, 2.5],
            [0, 0],
        ],
    ], //will be refreshed from outside
};

export const configWinPopupAnimation: IConfigWinPopupAnimation = {
    scaleFactor: 2,
    generateFrames: (scene: Phaser.Scene, textureKey: string) => {
        const frm = scene.anims.generateFrameNames(textureKey);

        scene.anims.generateFrameNames(textureKey);
        const winFrames = _sortBy(frm, ['frame']);
        return winFrames;
    },
    frameRate: 25,
    shouldDo: false,
};

export const configAnimationWin: IConfigAnimationWin = {
    allLinesDuration: 3000,
    lineByLineDuration: 1000,
    backgroundWinDuration: 4100,
    winStaysConstantlyInFreeSpins: true,
    showNearLineAmounts: false,
    winTextForcedY: (data: IReelCoordinatesData) => {
        return (
            data.reelsCoords[2].y + data.reelsScale * data.symbolsCoords[2][1].y
        );
    },
    winTextHasBackLight: true,
    lineWinTextScaleFactor: 0.7,
};

export const configSceneReels: IConfigSceneReels = {
    nearWinProlongSymbol: 8,
    nearWinProlongSymbolCount: 2,
    hasReelBg: false,
    hasReelShadow: false,
    zoomFactorLandscape: 1,
    zoomLandC1: 1.3,
    zoomLandC2: 1.1,
    zoomLandC3: 1.3,
    zoomFactorPortrait: 1,
    bgYLandscape: 30,
    isOnCenterLandscape: true,
    bgYPortrait: 0,
    depth: 0,
    wildIndex: -1,
    portraitBgTexture: true,
    landscaleScaleFitByHeight: true,
    resizeReel: (
        bg: Phaser.GameObjects.Image,
        i: number,
        reel: Reel,
        symbolSize: IPointData,
        scaleFactor: number,
        shouldWriteMask: boolean,
        isPortrait?: boolean
    ) => {
        let reelOffsetX = 800//931;
        let reelOffsetY = 240;
        if (isPortrait) {
            reelOffsetX = 0;
            reelOffsetY = 870;
        }

        //bg.setActive(false).setVisible(false)

        reel.x =
            bg.x -
            bg.displayWidth / 2 +
            (reelOffsetX + (symbolSize.x + (isPortrait ? -40 : 11.5)) * i) *
            scaleFactor;
        reel.y = bg.y + scaleFactor * reelOffsetY;
        reel.setScale((isPortrait ? 0.85 : 1) * scaleFactor);

        const maskOffsetW = 0.15;
        const maskOffsetH = 0.02;
        let maskOffsetBottom = -0.07;
        if (isPortrait) {
            maskOffsetBottom = -0.45
        }

        const maskGraphics = (reel.mask as Phaser.Display.Masks.GeometryMask)
            .geometryMask;
        maskGraphics.clear();

        //if (shouldWriteMask) {//TODO - wtf!!
        maskGraphics.fillRect(
            reel.x - symbolSize.x * scaleFactor * maskOffsetW,
            reel.y - symbolSize.y * scaleFactor * maskOffsetH,
            symbolSize.x * scaleFactor * (1 + 2 * maskOffsetW),
            symbolSize.y *
            scaleFactor *
            (3 + 2 * maskOffsetH + maskOffsetBottom)
        );
    },
};

export const configParticleWinAnimation: IConfigParticleWinAnimation = {
    generateParticleNames: (
        scene: Phaser.Scene,
        animTextureKey: string
    ): Phaser.Types.Animations.AnimationFrame[][] => {
        const myFrames = [];

        let frames = scene.anims.generateFrameNames(animTextureKey);

        frames = _sortBy(frames, ['frame']);
        myFrames[0] = frames;
        return myFrames;
    },
    frameRate: 40,
};

export const configAnimatedWinLines: IConfigAnimatedWinLines = {
    generateAnimationFrames: (
        scene: Phaser.Scene,
        animTextureKey: string
    ): Phaser.Types.Animations.AnimationFrame[][] => {
        const animationFrames = [];
        for (let i = 0; i < configAnimatedWinLines.numberOfWinLines; i++) {
            let frames = scene.anims.generateFrameNames(animTextureKey, {
                start: 0,
                end: 23,
                zeroPad: 2,
                prefix: `${i < 10 ? '0' : ''}${i}/anim_`,
            });
            frames = _sortBy(frames, ['frame']);
            animationFrames[i] = frames;
        }
        return animationFrames;
    },
    frameRate: 24,
    scale: 0.342,
    numberOfWinLines: 20,
    gfxData: [
        { offsetY: 0, flipY: false }, //0
        { offsetY: -1, flipY: false }, //1
        { offsetY: 1, flipY: false }, //2
        { offsetY: 0, flipY: false }, //3
        { offsetY: 0, flipY: true }, //4
        { offsetY: -1, flipY: true }, //5
        { offsetY: 1, flipY: false }, //6
        { offsetY: 0, flipY: false }, //7
        { offsetY: 0, flipY: true }, //8
        { offsetY: -0.5, flipY: false }, //9
        { offsetY: 0.5, flipY: true }, //10
        { offsetY: -0.5, flipY: true }, //11
        { offsetY: 0.5, flipY: false }, //12
        { offsetY: 0, flipY: false }, //13
        { offsetY: 0, flipY: true }, //14
        { offsetY: -1, flipY: false }, //15
        { offsetY: 1, flipY: true }, //16
        { offsetY: 0, flipY: true }, //17
        { offsetY: 0, flipY: false }, //18
        { offsetY: 0, flipY: false }, //19
    ],
    scaleFactorW: 1,
    scaleFactorH: 0.9,
};

export const configSidePanel: IConfigSidePanel = {
    data: {
        size: {
            portrait: {
                width: 580,
                height: 1069,
            },
            landscape: {
                width: 467,
                height: 782,
            },
        },
        bmdTexture: {
            key: 'sidePanelBmdBg',
            width: 550,
            height: 500,
            visible: false,
        },
        positionLand: {
            scaleX: 0.85 * 0.99,
            scaleY: 0.75 * 1.,
            xAdditional: 12,
            yAdditional: 43,
        },
        positionPort: {
            scaleX: 1.05,
            scaleY: 1.05,
            xAdditional: 2,
            yAdditional: -24,
        },
        emitDimensions: false,
        offsets: {
            reelOffsetW: -20,
            reelsOffsetH: 20,
            overlapOffsetX: 22,
            overlapOffsetY: -30,
        },
        prizeLevels: 6,
        prizeMinRequirement: 3,
        tableBgActualHeightDiff: -140,
        pulseDuration: 2000,
        prizeSpriteCfg: {
            offsetTop: 5,
            offsetLeft: 80,
            offsetX: 10,
            additionalOffsetY: [0, 5, 0, 4, 0, 0],
            frameRate: 40,
            scaleLandscape: 0,//0.8,
            scalePortrait: 0,
            // activeOverlay: {
            //     winActivatesAllSprites: true,
            // },
            // baseOverlay: {
            //     offsetX: 5,
            //     offsetY: 2,
            // },
        },
        bitmapTextCfg: {
            textureKey: 'prizeFont',
            offsetTop: 80,
            offsetX: -110,
            size: 45,
            offsetY: 2,
            layeredDesign: {
                mainLayers: {
                    count: 1,
                    fadeOutForWin: true,
                    fadeOutForIdlePulse: true,
                },
                additionalLayers: {
                    count: 2,
                    hasActiveOverlay: true,
                },
            },
        },
        additionalSpriteCfg: {
            textureKey: 'lion',
            winAnimation: {
                animationPreexisting: false,
                textureKey: 'lionAnim',
                scale: 0.64,
                portraitScaleFactor: 1.22,
                frameRate: 30,
                loop: 0,
            },
            // idleAnimation: {
            //     textureKey: "lionAnim",
            //     scale: 0.64,
            //     frameRate: 30,
            //     portraitScaleFactor: 1.22
            // },
            scalePortrait: 0.9,
            scaleLandscape: 0.75,
            offsets: {
                portrait: {
                    offsetFactorYRelativeToLogo: 0,
                    offsetY: -40,
                    offsetX: -55,
                },
                landscape: {
                    offsetFactorYRelativeToLogo: 0,
                    offsetY: 105,
                    offsetX: 55,
                },
            },
        },
    },
};

export const animatedLogoCfg: IAnimatedLogoCfg = {
    scale: 0.46,
    frameRate: 20,
    advanced: {
        scaleFactorPortrait: 0.5,
        scaleFactorLandscape: 0.35,
        backgroundImage: {
            xPortrait: 0,
            xLandscape: 135,
            yPortrait: 20,
            yLandscape: 0,
            contentOffsetX: 0,
            contentOffsetY: 20,
        },
    },
};

export const winFramesConfig: IWinFramesConfig = {
    scaleFactor: 2,
    frameRate: 30,
    animationFrames: null,
};

export const SYMBOLS_NUMBER = 10;

const SYMBOLS_SCALE = 1 / 0.47;
export const SYMBOLS_SCALE_ANIM = [
    { x: 1, y: 1 }, //0
];
SYMBOLS_SCALE_ANIM.forEach((element) => {
    element.x *= SYMBOLS_SCALE;
    element.y *= SYMBOLS_SCALE;
});

export const SYMBOLS_SCALE_DEFAULT = [
    { x: 1, y: 1 }, //0
];

export const SYMBOLS_FPS = 0//30;

export const SHOW_LOGO = true;

export const BG_IMAGE_SCALE = 1;

export const PIXEL_PERFECT_BUTTONS = false;

export { createCheckBoxJack as createCheckBox };

export { createPopupButtonFlamingHotJoker as createPopupButton };

export { basePopupStyleJack as basePopupStyle };

export { createOverlaysFlamingHotJoker as createOverlays };

export const horizontalDesignUI = true;

export const BONUS_POPUP_DURATION = -1;

export const CLOSE_BET_POPUP_ON_BET_CHANGE = false;

export const PRELOAD_ANIMATE_GAME_LOGO = true;
setAnimateBacklightInsteadOfLogo(true);
setPreloadStartBackgroundAnimations(true);

export let THREE_SECOND_RULE = false;
const threeSecRule = getQueryParams('threeSecRule');
if (threeSecRule) {
    THREE_SECOND_RULE = threeSecRule != 'false' ? true : false;
}

export let COMPLEX_AUTO_SPIN = false;
const urlLimits = getQueryParams('autospinLimits');
if (urlLimits) {
    COMPLEX_AUTO_SPIN = urlLimits != 'false' ? true : false;
}

setPreloadHasFadeInShadow(false);


setFreeSpinsIntroOnReels(true);
