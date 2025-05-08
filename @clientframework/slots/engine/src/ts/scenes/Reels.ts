import _forEach from 'lodash-es/forEach';
import _range from 'lodash-es/range';
import _sortBy from 'lodash-es/sortBy';
import ComponentLayer from '@commonEngine/Scenes/ComponentLayer';
import Reel from '../game-objects/Reel';
import ReelSymbol from '../game-objects/ReelSymbol';
import { IPointData } from '../dataPresenterVisual/iPointData';
import { IReelCoordinatesData } from '../dataPresenterVisual/iReelCoordinatesData';
import {
    IReelsDataPresenter,
    ISlotDataPresenter,
} from '../dataPresenter/interfaces';
import { slotDataPresenter } from '../dataPresenter/instances';

import {
    configSceneReels,
    SYMBOLS_NUMBER,
    SHOW_LOGO,
    SYMBOLS_FPS,
    animatedLogoCfg,
    winFramesConfig,
    THREE_SECOND_RULE,
    configSidePanel,
} from '@specific/config';
import { createGameObjectsBehindSymbols } from '@specific/specifics/createGameObjectsBehindSymbols';
import { CHEAT_TOOL } from '@specific/dataConfig';
import { globalGetIsPortrait } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/globalGetIsPortrait';
import { Factory } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/factory/factory';
import {
    getReelsNumber,
    getHasIntroAfterLoadingScreen,
} from '../dataPresenter/defaultConfigSlot';

export interface IConfigSceneReels {
    wildIndex: number;
    nearWinProlongSymbol: number;
    nearWinProlongSymbolCount: number;
    bgAlpha?: number;
    hasReelBg: boolean;
    hasReelShadow: boolean;
    depth: number;
    zoomFactorLandscape: number;
    zoomLandC1?: number;
    zoomLandC2?: number;
    zoomLandC3?: number;
    zoomFactorPortrait: number;
    bgYLandscape: number;
    bgYPortrait: number;
    portraitBgTexture?: boolean; //non existing and false by default
    landscaleScaleFitByHeight?: boolean; //non existing and false by default
    portraitScaleAdditionalOffset?: number;
    portraitYAddtionalOffset?: number;
    zoomFactor?: number;
    isOnCenterLandscape?: boolean;
    resizeReel: (
        bg: Phaser.GameObjects.Image,
        i: number,
        reel: Reel,
        symbolSize: IPointData,
        scaleFactor: number,
        shouldWriteMask: boolean,
        isPortrait?: boolean
    ) => void;
}

export interface IAnimatedLogoCfg {
    scale: number;
    frameRate: number;
    advanced?: {
        bgAlpha?: number;
        scaleFactorPortrait: number;
        scaleFactorLandscape: number;
        backgroundImage?: {
            xPortrait: number;
            xLandscape: number;
            yPortrait: number;
            yLandscape: number;
            contentOffsetX: number;
            contentOffsetY: number;
        };
    };
}

export default class Reels<
    ReelClass extends Reel = Reel
> extends ComponentLayer {
    static SIZE = new Phaser.Structs.Size(1920, 1080);
    reelBg: Phaser.GameObjects.Image;
    bg: Phaser.GameObjects.Image;
    reelShadow: Phaser.GameObjects.Image;
    logoCfg: IAnimatedLogoCfg;
    logo: Phaser.GameObjects.Sprite;
    logoBg: Phaser.GameObjects.Image;
    sidePanelH = 0;
    sidePanelW = 0;
    slotdata;
    debugGraphics: Phaser.GameObjects.Graphics;

    reels: ReelClass[] = [];
    reelsSpinning: number[] = [0, 0, 0, 0, 0];
    lastSpinStartTime = 0;

    constructor(protected reelFactory?: Factory<ReelClass>) {
        super({
            key: 'Reels',
        });
        if (!reelFactory) {
            this.reelFactory = new Factory<Reel>(Reel) as Factory<ReelClass>;
        }
    }

    create(/*data: object*/): void {
        console.log('Reels create');
        this.lastSpinStartTime = this.time.now + 3000;
        if (configSceneReels.hasReelBg) {
            this.reelBg = this.add.image(0, 0, 'bg-reels');
        }
        this.bg = this.add.image(0, 0, 'reels');
        if (configSceneReels.hasReelShadow) {
            this.reelShadow = this.add.image(0, 0, 'reelShadow');
        }

        this.reelBg && this.reelBg.setOrigin(0.5, 0);
        this.bg.setOrigin(0.5, 0);
        if (configSceneReels.hasOwnProperty('bgAlpha')) {
            this.bg.setAlpha(configSceneReels.bgAlpha); //not showing as it will create issue
        }
        this.reelShadow && this.reelShadow.setOrigin(0.5, 0);

        this.reelBg &&
            this.reelBg.setSize(this.bg.width * 0.975, this.bg.height * 0.97);

        this.reelBg && this.reelBg.setDepth(configSceneReels.depth);
        this.bg.setDepth(configSceneReels.depth);
        //this.reelShadow.setDepth(1)

        createGameObjectsBehindSymbols(this);

        const dataPresenter = slotDataPresenter;

        for (let i = 0; i < getReelsNumber(); i++) {
            this.reels.push(
                this.reelFactory.createInstance(
                    this,
                    dataPresenter,
                    winFramesConfig,
                    0,
                    0,
                    i
                )
            );
        }

        if (SHOW_LOGO) {
            this.logoCfg = animatedLogoCfg;
            if (
                this.logoCfg &&
                this.logoCfg.advanced &&
                this.logoCfg.advanced.backgroundImage
            ) {
                this.logoBg = this.add.image(0, 0, 'logo-bg');
                if (this.logoCfg.advanced.hasOwnProperty('bgAlpha')) {
                    this.logoBg.alpha = this.logoCfg.advanced.bgAlpha;
                }
                this.logoBg.setDepth(1);
                this.logoBg.setOrigin(0.5, 0);
            }
            this.logo = this.add.sprite(0, 0, 'logo');
            this.logo.setOrigin(0.5, 0);
            this.logo.setDepth(1);
        }

        this.debugGraphics = this.add.graphics({
            lineStyle: {
                color: 0x00ff00,
                width: 2,
            },
            fillStyle: {
                alpha: 0,
            },
        });
        this.debugGraphics.visible = false;

        this.cameras.main.setOrigin(0.5, 0);

        this.createEventListeners();

        this.resize();

        // this.spin();
        // this.time.addEvent({
        //     delay: 5500,
        //     repeat: 6,
        //     callback: this.spin,
        //     callbackScope: this
        // });

        this.reels[2].symbols[2].setInteractive();
        this.reels[2].symbols[2].on(
            'pointerdown',
            () => {
                if (CHEAT_TOOL) {
                    this.game.events.emit('event-open-cheat-tool');
                } /* else {
                    const isForcing = true;
                    this.game.events.emit(
                        `event-user-input-${eUserInputCommands.spinPressed}`,
                        Phaser.Input.Keyboard.KeyCodes.F,
                        isForcing
                    );
                }*/
            },
            this
        );
    }

    private createEventListeners(): void {
        this.game.events.on(
            'event-request-reels-scene-coords-data',
            this.emitCoordsData,
            this
        );
        let numberOfRunningReels = 0;
        this.game.events.on(
            'event-reel-spin-started',
            (reelIndex: number) => {
                console.log('on event-reel-spin-started');
                numberOfRunningReels++;
                this.reelsSpinning[reelIndex] = 1;
            },
            this
        );
        this.game.events.on(
            'event-reel-spin-completed',
            (reelIndex: number) => {
                console.log('on event-reel-spin-completed');
                numberOfRunningReels--;
                this.reelsSpinning[reelIndex] = 0;
                if (numberOfRunningReels == 0) {
                    this.resize();
                    const timeSinceLastSpin =
                        this.time.now - this.lastSpinStartTime;
                    setTimeout(
                        () => {
                            this.game.events.emit(
                                'event-animation-rotation-end',
                                slotDataPresenter.futureStatus.win
                            );
                        },
                        THREE_SECOND_RULE && timeSinceLastSpin < 3000
                            ? 3000 - timeSinceLastSpin
                            : 0
                    );
                }
            },
            this
        );
        this.game.events.on(
            'event-state-StatePresentSpinning-onEnter',
            (data: ISlotDataPresenter) => {
                this.updateFutureReels(data.futureReels);
                this.spin(data.settings.turboOn, data);
            },
            this
        );

        this.game.events.on('event-animate-symbols', this.animateSymbols, this);
        this.game.events.on(
            'event-stop-animate-symbols',
            this.stopAnimateSymbols,
            this
        );

        let reelsInited = false;
        this.game.events.on(
            'event-data',
            (data: ISlotDataPresenter) => {
                this.slotdata = data;
                if (!reelsInited) {
                    console.log('AAAAAAAAAAA');
                    reelsInited = true;
                    this.updateFutureReels(data.reels, true);
                }
            },
            this
        );
        this.game.events.on(
            'event-refresh-current-reels',
            (reels: IReelsDataPresenter) => {
                console.log('on event-refresh-current-reels', reels);
                this.updateFutureReels(reels, true);
            }
        );

        this.game.events.on(
            'event-update-sidepanel-dimensions',
            (width: number, height: number) => {
                if (width) {
                    this.sidePanelW = width;
                }
                if (height) {
                    this.sidePanelH = height;
                }
                this.resizeInternal(this.scale.gameSize, false);
            }
        );

        this.game.events.once('event-reels-scene-coords-data', () => {
            if (!getHasIntroAfterLoadingScreen()) {
                this.game.events.emit('event-scenes-loaded');
            }
        });

        this.game.events.emit('event-request-data');
        this.createSpecificEventListeners();
    }

    protected createSpecificEventListeners(): void {
        //hook
    }

    protected animateSymbols(affectedSymbolBits: number): void {
        _forEach(this.reels, (reel: Reel, i: number) => {
            reel.stopAnimationsAndResetPicture();
            _forEach(reel.symbols, (sym, j) => {
                const jj = j - 1;
                if (jj >= 0 && (affectedSymbolBits >> (3 * i + jj)) & 1) {
                    reel.startSymbolAnimation(jj);
                }
            });
        });
    }

    protected stopAnimateSymbols(): void {
        _forEach(this.reels, (reel: Reel) => {
            reel.stopAnimationsAndResetPicture();
        });
    }

    protected updateFutureReels(
        data: IReelsDataPresenter,
        isInitial = false
    ): void {
        console.log('!!!updateFutureReels!!!', data);
        _forEach(this.reels, (reel: Reel, i: number) => {
            const array = [];
            for (let j = 0; j < data.rowsNum; j++) {
                array.push(data.screen[j][i]);
            }
            console.log('array = ', array);
            reel.updateSymbolsFromData(array, !isInitial);
            reel.positionSymbols();
        });

        if (!isInitial) {
            this.checkForNearWinProlong(
                data,
                configSceneReels.nearWinProlongSymbol,
                configSceneReels.nearWinProlongSymbolCount
            );
        }
    }

    private checkForNearWinProlong(
        data: IReelsDataPresenter,
        nearWinProlongSym,
        nearWinProlongCount
    ): void {
        if (
            nearWinProlongSym !== undefined &&
            nearWinProlongCount != undefined
        ) {
            let symsCnt = 0;
            let prolongFound = 0;
            for (let i = 0; i < this.reels.length; i++) {
                this.reels[i].isProlongInitial = false;
                this.reels[i].shouldProlong = 0;
                if (prolongFound) {
                    this.reels[i].shouldProlong = prolongFound;
                }

                for (let j = 0; j < data.rowsNum; j++) {
                    if (data.screen[j][i] == nearWinProlongSym) {
                        symsCnt++;
                    }
                }
                // prolong as long as we have 2 or more free spin scatters in the reels
                if (symsCnt >= nearWinProlongCount && i < data.reelsNum - 1) {
                    prolongFound++;
                    if (prolongFound == 1) {
                        this.reels[i].isProlongInitial = true;
                    }
                }
            }
        }
    }

    spin(turboOn: boolean, data: ISlotDataPresenter): void {
        data;
        console.log('event-animation-rotation-start');
        this.lastSpinStartTime = this.time.now;
        this.game.events.emit('event-animation-rotation-start');
        _forEach(this.reels, (reel: Reel, i: number) => {
            this.spinSingleReel(reel, i, turboOn);
        });
        this.resize();
    }

    protected spinSingleReel(reel: Reel, i: number, turboOn: boolean): void {
        reel.spin(i, i * (THREE_SECOND_RULE ? 325 : 200), turboOn);
    }

    orientationChange(): void {
        this.resize();
    }

    resize(gameSize = this.scale.gameSize): void {
        this.resizeInternal(gameSize, true);
    }

    resizeInternal(gameSize = this.scale.gameSize, shouldEmit: boolean): void {
        let zoom;

        if (!globalGetIsPortrait(this)) {
            zoom =
                this.resizeLandscape(gameSize) *
                configSceneReels.zoomFactorLandscape;
        } else if (globalGetIsPortrait(this)) {
            zoom =
                this.resizePortrait(gameSize) *
                configSceneReels.zoomFactorPortrait;
        }

        if (this.reelBg) {
            this.reelBg.x = this.bg.x;
            this.reelBg.y = this.bg.y;
            this.reelBg.setScale(this.bg.scale);
        }
        if (this.reelShadow) {
            this.reelShadow.x = this.bg.x;
            this.reelShadow.y =
                this.bg.y +
                (this.bg.height - 0.5 * this.reelShadow.height) * this.bg.scale;
            this.reelShadow.setScale(this.bg.scale);
        }

        this.resizeIndividualReels();

        this.cameras.main.setZoom(zoom);
        this.cameras.main.scrollX = -gameSize.width / 2;

        this.resizeInternalSpecificPost(gameSize, shouldEmit);

        if (shouldEmit) {
            this.emitCoordsData();
        }
    }

    resizeInternalSpecificPost(
        gameSize = this.scale.gameSize,
        shouldEmit: boolean
    ): void {
        gameSize;
        shouldEmit;
    }

    /**
     * @param gameSize
     * @return number - zoom factor
     */
    resizeLandscape(gameSize = this.scale.gameSize): number {
        //if (configSceneReels.portraitBgTexture) {
        this.bg.setTexture('reels');
        //}
        this.bg.y = configSceneReels.bgYLandscape;
        const baseFactor = 1 - 1 / Reels.SIZE.aspectRatio;

        this.bg.setScale(
            configSceneReels.landscaleScaleFitByHeight
                ? Reels.SIZE.height / this.bg.height
                : 1470 / (this.sidePanelW * baseFactor + this.bg.width)
        );
        this.bg.x = this.sidePanelW * baseFactor;
        if (this.reelBg) {
            this.reelBg.x = this.bg.x;
        }
        if (this.reelShadow) {
            this.reelShadow.x = this.bg.x;
        }

        if (this.logo) {
            this.logo.x =
                this.logoCfg.advanced && this.logoCfg.advanced.backgroundImage
                    ? this.logoCfg.advanced.backgroundImage.xLandscape +
                      this.logoCfg.advanced.backgroundImage.contentOffsetX
                    : 0;
            this.logo.y =
                this.logoCfg.advanced && this.logoCfg.advanced.backgroundImage
                    ? this.logoCfg.advanced.backgroundImage.yLandscape +
                      this.logoCfg.advanced.backgroundImage.contentOffsetY
                    : 0;
            let logoScale = 1;

            if (this.logoCfg.advanced) {
                // 8godlenlions
                logoScale =
                    this.logoCfg.advanced.scaleFactorPortrait /
                    this.logoCfg.scale;
            } else {
                // classic slots
                logoScale = ((1 / this.logoCfg.scale) * 170) / this.logo.height;
            }

            this.logo.setScale(logoScale);
            if (this.logoBg) {
                this.logoBg.x =
                    this.logoCfg.advanced &&
                    this.logoCfg.advanced.backgroundImage
                        ? this.logoCfg.advanced.backgroundImage.xLandscape
                        : 0;
                this.logoBg.y =
                    this.logoCfg.advanced &&
                    this.logoCfg.advanced.backgroundImage
                        ? this.logoCfg.advanced.backgroundImage.yLandscape
                        : 0;
                this.logoBg.setScale(logoScale);
            }
        }

        if (this.logoCfg && this.logoCfg.advanced) {
            // 8godlenlions
            this.logo &&
                this.logo.setScale(
                    0.75 * this.logoCfg.advanced.scaleFactorLandscape /
                        this.logoCfg.scale
                );
            this.logoBg &&
                this.logoBg.setScale(
                    this.logoCfg.advanced.scaleFactorLandscape /
                        this.logoCfg.scale
                );
        }

        // this.debugGraphics.clear();
        // this.debugGraphics.strokeRect(-690, 0, 1380, 920);

        if (
            Reels.SIZE.aspectRatio <
            (configSceneReels.zoomLandC1 ? configSceneReels.zoomLandC1 : 1) *
                gameSize.aspectRatio
        ) {
            return (
                ((configSceneReels.zoomLandC2
                    ? configSceneReels.zoomLandC2
                    : 1) *
                    gameSize.height) /
                Reels.SIZE.height
            );
        } else {
            const retZoom =
                ((configSceneReels.zoomLandC3
                    ? configSceneReels.zoomLandC3
                    : 1) *
                    gameSize.width) /
                Reels.SIZE.width;
            if (configSceneReels.isOnCenterLandscape && this.bg) {
                const landOffsetCenter =
                    (0.5 * gameSize.height) / retZoom -
                    (this.bg.scale * this.bg.height) / 2;
                this.bg.y += landOffsetCenter;
                if (this.logo) {
                    this.logo.y += landOffsetCenter;
                }
                if (this.logoBg) {
                    this.logoBg.y += landOffsetCenter;
                }
            }
            return retZoom;
        }
    }

    /**
     * @param gameSize
     * @return number - zoom factor
     */
    resizePortrait(gameSize = this.scale.gameSize): number {
        this.bg.setTexture(
            configSceneReels.portraitBgTexture ? 'reels-portrait' : 'reels'
        );
        const baseFactor = 1 - 1 / Reels.SIZE.aspectRatio;
        const offsetFactor = 1 / Reels.SIZE.aspectRatio - gameSize.aspectRatio;

        this.bg.y =
            configSceneReels.bgYPortrait +
            this.sidePanelH * offsetFactor +
            (offsetFactor / baseFactor) *
                (configSceneReels.portraitYAddtionalOffset
                    ? configSceneReels.portraitYAddtionalOffset
                    : 0);
        this.bg.setScale(
            (Reels.SIZE.height +
                (configSceneReels.portraitScaleAdditionalOffset
                    ? configSceneReels.portraitScaleAdditionalOffset
                    : 0)) /
                this.bg.width
        );
        this.bg.x = 0;
        if (this.reelBg) {
            this.reelBg.x = this.bg.x;
        }
        if (this.reelShadow) {
            this.reelShadow.x = this.bg.x;
        }

        if (this.logo) {
            const logoY = 50 + (60 * offsetFactor) / baseFactor;
            let logoScale = 1;
            if (this.logoCfg.advanced) {
                this.logo.x = this.logoCfg.advanced.backgroundImage
                    ? this.logoCfg.advanced.backgroundImage.xPortrait +
                      this.logoCfg.advanced.backgroundImage.contentOffsetX
                    : 0;
                this.logo.y = this.logoCfg.advanced.backgroundImage
                    ? this.logoCfg.advanced.backgroundImage.yPortrait +
                      this.logoCfg.advanced.backgroundImage.contentOffsetY + 10
                    : 0;
                logoScale =
                    this.logoCfg.advanced.scaleFactorPortrait /
                    this.logoCfg.scale;
            } else {
                this.logo.x = 0;
                this.logo.y = logoY;
                logoScale = Math.min(
                    880 / this.logo.width,
                    this.bg.y / this.logo.height + 0.35
                );
            }

            this.logo.setScale(logoScale / 1.4);
            if (this.logoBg) {
                this.logoBg.x =
                    this.logoCfg.advanced &&
                    this.logoCfg.advanced.backgroundImage
                        ? this.logoCfg.advanced.backgroundImage.xPortrait
                        : 0;
                this.logoBg.y =
                    this.logoCfg.advanced &&
                    this.logoCfg.advanced.backgroundImage
                        ? this.logoCfg.advanced.backgroundImage.yPortrait
                        : 0;
                this.logoBg.setScale(logoScale);
            }
        }

        this.debugGraphics.clear();
        this.debugGraphics.strokeRect(-539, 0, 1078, 960);

        return gameSize.width / Reels.SIZE.height;
    }

    resizeIndividualReels(scaleFactor = this.bg.scaleX): void {
        _forEach(this.reels, (reel: Reel, i: number) => {
            configSceneReels.resizeReel(
                this.bg,
                i,
                reel,
                ReelSymbol.SIZE,
                scaleFactor,
                this.reelsSpinning[i] ? true : false,
                globalGetIsPortrait(this)
            );
            reel.symbols.forEach((symbol: ReelSymbol) => symbol.resize());
        });
    }

    addAnimations(fps: number = SYMBOLS_FPS): void {
        if (SYMBOLS_FPS <= 0) {
            // if the sidepanels winAnimation.textureKey contians sym_, we must create that animation for the sidepanel
            if (
                configSidePanel &&
                configSidePanel.data &&
                configSidePanel.data.additionalSpriteCfg &&
                configSidePanel.data.additionalSpriteCfg.winAnimation &&
                configSidePanel.data.additionalSpriteCfg.winAnimation.textureKey.includes(
                    'sym_'
                )
            ) {
                let frames: Phaser.Types.Animations.AnimationFrame[] = this.anims.generateFrameNames(
                    'symbols',
                    {
                        start: 0,
                        end: 29,
                        zeroPad: 2,
                        prefix: 'anim_SYMBOLS/sym_9_anim_',
                    }
                );

                frames = _sortBy(frames, ['frame']);

                this.anims.create({
                    key: 'sym_9',
                    frames: frames,
                    frameRate: 30,
                    repeat: -1,
                });
            }
            return;
        }
        _forEach(_range(SYMBOLS_NUMBER), (i: number) => {
            let frames: Phaser.Types.Animations.AnimationFrame[] = [];
            let framesDrop: Phaser.Types.Animations.AnimationFrame[] = [];
            _forEach(
                (<Phaser.Textures.Texture>(<any>this.textures.list).symbols)
                    .frames,
                (frame, name) => {
                    if (name.includes(`anim_SYMBOLS/sym_${i}_anim_`)) {
                        frames.push({
                            key: 'symbols',
                            frame: name,
                        });
                    }

                    if (name.includes(`anim_SYMBOLS/sym_${i}_drop_`)) {
                        framesDrop.push({
                            key: 'symbols',
                            frame: name,
                        });
                    }
                }
            );
            frames = _sortBy(frames, ['frame']);

            this.anims.create({
                key: `sym_${i}`,
                frames: frames,
                frameRate: fps,
                repeat: -1,
            });

            if (framesDrop.length > 0) {
                framesDrop = _sortBy(framesDrop, ['frame']);
                console.log('frames drop', framesDrop);
                framesDrop.splice(framesDrop.length / 2);

                this.anims.create({
                    key: `sym_${i}_drop`,
                    frames: framesDrop,
                    frameRate: fps,
                    repeat: 0,
                });
                ReelSymbol.DROP_ANIM_INDEXES.push(i);
            }
        });

        console.log(
            'ReelSymbol.DROP_ANIM_INDEXES',
            ReelSymbol.DROP_ANIM_INDEXES
        );
    }

    protected emitCoordsData(): void {
        const symbolsCoords: IPointData[][] = [];
        const reelsCoords: IPointData[] = [];

        _forEach(this.reels, (reel: Reel, i: number) => {
            reelsCoords.push({
                x: reel.x,
                y: reel.y,
            });
            symbolsCoords.push([]);
            _forEach(reel.symbols, (symbol: ReelSymbol, j: number) => {
                if (j > 0) {
                    const field: IPointData = {
                        x: symbol.x,
                        y: symbol.y,
                    };
                    symbolsCoords[i].push(field);
                }
            });
        });

        const reelsCoordinatesData: IReelCoordinatesData = {
            reelsScale: this.reels[0].scale,
            reelsCoords,
            symbolsCoords,
            camera: {
                scrollX: this.cameras.main.scrollX,
                scrollY: this.cameras.main.scrollY,
                zoom: this.cameras.main.zoom,
                originX: this.cameras.main.originX,
                originY: this.cameras.main.originY,
            },
            logo: {
                x: this.logo ? this.logo.x : 0,
                y: this.logo ? this.logo.y : 0,
                w: this.logo ? this.logo.width : 0,
                h: this.logo ? this.logo.height : 0,
                scale: this.logo ? this.logo.scale : 1,
            },
            bg: {
                x: this.bg ? this.bg.x : 0,
                y: this.bg ? this.bg.y : 0,
                w: this.bg ? this.bg.width : 0,
                h: this.bg ? this.bg.height : 0,
                scale: this.bg ? this.bg.scale : 1,
            },
        };
        //console.log("event-reels-scene-coords-data", reelsCoordinatesData);
        this.game.events.emit(
            'event-reels-scene-coords-data',
            reelsCoordinatesData
        );
    }

    inited = false;
    update(): void {
        if (!this.inited) {
            this.inited = true;
            this.resize();
        }
    }
}
