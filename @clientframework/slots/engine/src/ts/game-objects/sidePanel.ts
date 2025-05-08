import _sortBy from 'lodash-es/sortBy';
import { animatedLogoCfg } from '@specific/config';
import { generateRoundedRectTexture } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/GameObjects/helpers/generateRoundedRectTexture';
import { globalGetIsPortrait } from '@clientframework/slots/engine/@clientframework/common/engine/src/ts/globalGetIsPortrait';

export interface IConfigSidePanel {
    data?: {
        size: {
            portrait: {
                width: number;
                height: number;
            };
            landscape: {
                width: number;
                height: number;
            };
        };
        bmdTexture?: {
            //darko- this is only temporary. darko-dusan-rev-   background should have on/off switch, and in case of off - width height should be numbers
            key: string;
            width: number;
            height: number;
            visible: boolean;
        };
        positionPort?: {
            xAdditional: number; //darko-rev   //this is temporary    // it its default
            yAdditional: number; //darko-rev   //this is temporary    // it its default
            scaleX: number;
            scaleY: number;
        };
        positionLand?: {
            xAdditional: number; //darko-rev   //this is temporary    // it its default
            yAdditional: number; //darko-rev   //this is temporary    // it its default
            scaleX: number;
            scaleY: number;
        };
        emitDimensions?: boolean;
        offsets: {
            reelOffsetW: number;
            reelsOffsetH: number;
            overlapOffsetX: number;
            overlapOffsetY: number;
        };
        prizeLevels: number;
        prizeMinRequirement: number;
        tableBgActualHeightDiff: number;
        pulseDuration?: number;
        logoCfg?: {
            offsetY: number;
        };
        prizeSpriteCfg: {
            baseOverlay?: {
                offsetX: number;
                offsetY: number;
            };
            offsetTop: number;
            offsetLeft: number;
            offsetX: number;
            additionalOffsetY?: number[];
            scaleLandscape: number;
            scalePortrait: number;
            frameRate: number;
            activeOverlay?: {
                winActivatesAllSprites: boolean;
            };
        };
        bitmapTextCfg: {
            textureKey: string;
            offsetX: number;
            offsetTop: number;
            offsetY: number;
            additionalOffsetYSecond?: number;
            size: number;
            layeredDesign?: {
                mainLayers: {
                    count: number;
                    fadeOutForWin: boolean;
                    fadeOutForIdlePulse: boolean;
                };
                additionalLayers?: {
                    count: number;
                    hasActiveOverlay: boolean;
                };
            };
        };
        additionalSpriteCfg?: {
            textureKey: string;
            idleAnimation?: {
                textureKey: string;
                frameRate: number;
                scale?: number;
                portraitScaleFactor?: number;
            };
            winAnimation?: {
                animationPreexisting: boolean;
                textureKey: string;
                frameRate: number;
                scale?: number;
                portraitScaleFactor?: number;
                loop: number;
            };
            scalePortrait: number;
            scaleLandscape: number;
            offsets: {
                portrait: {
                    offsetFactorYRelativeToLogo: number;
                    offsetX: number;
                    offsetY: number;
                };
                landscape: {
                    offsetFactorYRelativeToLogo: number;
                    offsetX: number;
                    offsetY: number;
                };
            };
        };
    };
}

enum eLogoAdditionalSpriteStates {
    idle = 'idle',
    anim = 'anim',
    postAnim = 'postAnim',
}

export class SidePanel {
    private _width = 0;
    private _height = 0;

    protected logo: Phaser.GameObjects.Sprite;
    protected logoAdditionalSprite: Phaser.GameObjects.Sprite;
    protected logoAdditionalSpriteActive: Phaser.GameObjects.Sprite;
    protected logoAdditionalSpriteCurrentState: eLogoAdditionalSpriteStates =
        eLogoAdditionalSpriteStates.idle;

    protected prizeTableBg: Phaser.GameObjects.Image;
    protected prizeLevelSprites: Phaser.GameObjects.Sprite[];
    protected prizeLevelSpritesActive: Phaser.GameObjects.Sprite[];
    protected prizeLevelSpritesBase: Phaser.GameObjects.Sprite[];

    protected prizeLevelTexts: Phaser.GameObjects.BitmapText[][];
    protected prizeLevelTextCurrent: Phaser.GameObjects.BitmapText[];
    protected prizeLevelTextAdditional: Phaser.GameObjects.BitmapText[];

    protected showingTween: Phaser.Tweens.Tween;
    protected scaleTween: Phaser.Tweens.Tween;

    protected allElements: (
        | Phaser.GameObjects.Sprite
        | Phaser.GameObjects.Image
        | Phaser.GameObjects.BitmapText
    )[] = [];

    private lastPulseIndex = -1;
    private winCurrentIndex = -1;

    protected winAnimKey: string;

    private logoCfg;
    protected config: IConfigSidePanel['data'];

    constructor(private scene: Phaser.Scene, config: IConfigSidePanel) {
        this.config = config.data;

        if (this.config.bmdTexture) {
            generateRoundedRectTexture(
                this.scene,
                this.config.bmdTexture.key,
                this.config.bmdTexture.width,
                this.config.bmdTexture.height
            );
            this.prizeTableBg = this.scene.add.image(
                0,
                0,
                this.config.bmdTexture.key
            ); //'prize-table-bg');
            this.prizeTableBg
                .setActive(config.data.bmdTexture.visible)
                .setVisible(this.config.bmdTexture.visible);
        } else {
            this.prizeTableBg = scene.add.image(0, 0, 'prize-table-bg');
        }

        if (this.config.additionalSpriteCfg) {
            this.logoAdditionalSprite = scene.add.sprite(
                0,
                0,
                this.config.additionalSpriteCfg.textureKey,
                this.config.additionalSpriteCfg.textureKey
            );
            if (this.config.additionalSpriteCfg.winAnimation) {
                this.logoAdditionalSpriteActive = scene.add.sprite(
                    0,
                    0,
                    this.config.additionalSpriteCfg.textureKey,
                    this.config.additionalSpriteCfg.winAnimation.textureKey
                );
                this.logoAdditionalSpriteActive
                    .setActive(false)
                    .setVisible(false);
            }
            this.allElements.push(this.logoAdditionalSprite);
        }
        if (this.config.logoCfg) {
            this.logoCfg = animatedLogoCfg;
        }

        if (this.config.logoCfg) {
            this.logo = this.scene.add.sprite(0, 0, 'logoAnim', 'anim_00');
            let animFrames = this.scene.anims.generateFrameNames('logoAnim');
            animFrames = _sortBy(animFrames, ['frame']);
            this.scene.anims.create({
                key: 'logoAnimation',
                frames: animFrames,
                repeat: -1,
                frameRate: this.logoCfg.frameRate,
            });
            this.logo.on('animationcomplete', () => {
                this.logo.setFrame('anim_00');
            });
            this.allElements.push(this.logo);
        }
        if (this.config.prizeSpriteCfg.activeOverlay) {
            this.prizeLevelSpritesActive = [];
        }
        this.prizeLevelSprites = [];
        this.prizeLevelTexts = [];
        if (this.config.prizeSpriteCfg.baseOverlay) {
            this.prizeLevelSpritesBase = [];
        }
        if (
            this.config.bitmapTextCfg.layeredDesign &&
            this.config.bitmapTextCfg.layeredDesign.additionalLayers
        ) {
            this.prizeLevelTextCurrent = [];
            this.prizeLevelTextAdditional = [];
            let key = this.config.bitmapTextCfg.textureKey;
            if (
                this.config.bitmapTextCfg.layeredDesign.additionalLayers
                    .hasActiveOverlay
            ) {
                key += 'Active';
            }
            for (
                let j = 0;
                j <
                this.config.bitmapTextCfg.layeredDesign.additionalLayers.count;
                j++
            ) {
                this.prizeLevelTextCurrent[j] = scene.add.bitmapText(
                    0,
                    0,
                    key,
                    '',
                    this.config.bitmapTextCfg.size
                );
                this.prizeLevelTextCurrent[j]
                    .setVisible(false)
                    .setActive(false)
                    .setAlpha(1);
                this.prizeLevelTextAdditional[j] = scene.add.bitmapText(
                    0,
                    0,
                    key,
                    '',
                    this.config.bitmapTextCfg.size
                );
                this.prizeLevelTextAdditional[j]
                    .setVisible(false)
                    .setActive(false)
                    .setAlpha(1);
            }
        }

        for (let i = 0; i < this.config.prizeLevels; i++) {
            const val =
                this.config.prizeMinRequirement +
                this.config.prizeLevels -
                1 -
                i;
            const valString: string = val < 10 ? `0${val}` : val.toString();
            if (this.prizeLevelSpritesBase) {
                this.prizeLevelSpritesBase[i] = this.scene.add.sprite(
                    0,
                    0,
                    'sidePanelNums',
                    `${valString}_base`
                );
                this.prizeLevelSpritesBase[i]
                    .setActive(true)
                    .setVisible(true)
                    .setAlpha(1);
            }
            this.prizeLevelSprites[i] = this.scene.add.sprite(
                0,
                0,
                'sidePanelNums',
                `${valString}`
            );

            if (this.prizeLevelSpritesActive) {
                this.prizeLevelSpritesActive[i] = this.scene.add.sprite(
                    0,
                    0,
                    'sidePanelNums',
                    `${valString}_active`
                );
                this.prizeLevelSpritesActive[i]
                    .setActive(false)
                    .setVisible(false)
                    .setAlpha(1);
            }

            const animFrames = this.scene.anims.generateFrameNames(
                'sidePanelNums',
                { start: 0, end: 31, zeroPad: 2, prefix: `${valString}/anim_` }
            );
            this.scene.anims.create({
                key: `prizeAnim${val}`,
                frames: animFrames,
                repeat: -1,
                frameRate: this.config.prizeSpriteCfg.frameRate,
            });
            this.prizeLevelTexts[i] = [];
            let numberOfMainLayers = 1;
            if (
                this.config.bitmapTextCfg.layeredDesign &&
                this.config.bitmapTextCfg.layeredDesign.mainLayers
            ) {
                numberOfMainLayers = this.config.bitmapTextCfg.layeredDesign
                    .mainLayers.count;
            }
            for (let j = 0; j < numberOfMainLayers; j++) {
                this.prizeLevelTexts[i][j] = this.scene.add.bitmapText(
                    0,
                    0,
                    this.config.bitmapTextCfg.textureKey,
                    '',
                    this.config.bitmapTextCfg.size
                );
            }
            this.allElements.push(...this.prizeLevelTexts[i]);

            this.prizeLevelSprites[i].on(
                'animationcomplete',
                () => {
                    this.prizeLevelSprites[i].setFrame(`${valString}`);
                },
                this
            );
        }
        this.prizeLevelSpritesActive &&
            this.allElements.push(...this.prizeLevelSpritesActive);

        this.idlePulse(this.config.prizeLevels - 1);

        if (this.config.additionalSpriteCfg) {
            if (this.config.additionalSpriteCfg.winAnimation) {
                if (
                    this.config.additionalSpriteCfg.winAnimation
                        .animationPreexisting
                ) {
                    this.winAnimKey = this.config.additionalSpriteCfg.winAnimation.textureKey;
                } else {
                    this.winAnimKey = 'additionalSpriteWinAnim';
                    let additionalSpriteFrames = this.scene.anims.generateFrameNames(
                        this.config.additionalSpriteCfg.winAnimation.textureKey
                    );
                    additionalSpriteFrames = _sortBy(additionalSpriteFrames, [
                        'frame',
                    ]);
                    this.scene.anims.create({
                        key: this.winAnimKey,
                        frames: additionalSpriteFrames,
                        repeat: this.config.additionalSpriteCfg.winAnimation
                            .loop,
                        frameRate: this.config.additionalSpriteCfg.winAnimation
                            .frameRate,
                    });
                }

                this.logoAdditionalSprite.on(
                    'animationcomplete',
                    (args) => {
                        if (args.key === this.winAnimKey) {
                            this.logoAdditionalSpriteSetCurrentState(
                                eLogoAdditionalSpriteStates.postAnim
                            );
                        }
                    },
                    this
                );

                // this.logoAdditionalSprite.on("animationcomplete", (args) => {
                //     if(args.key === "additionalSpriteWinAnim") {
                //         let isPort = globalGetIsPortrait(this.scene);
                //         this.logoAdditionalSprite.setFrame(
                //             `lion_active${isPort ? "-portrait" : ""}`
                //         );
                //     }
                // }, this);
            }
            if (this.config.additionalSpriteCfg.idleAnimation) {
                let additionalSpriteFrames = this.scene.anims.generateFrameNames(
                    this.config.additionalSpriteCfg.idleAnimation.textureKey
                );
                additionalSpriteFrames = _sortBy(additionalSpriteFrames, [
                    'frame',
                ]);
                this.scene.anims.create({
                    key: 'additionalSpriteIdleAnim',
                    frames: additionalSpriteFrames,
                    repeat: -1,
                    frameRate: this.config.additionalSpriteCfg.idleAnimation
                        .frameRate,
                });
                this.logoAdditionalSprite.play('additionalSpriteIdleAnim');
                this.logoAdditionalSpriteSetCurrentState(
                    eLogoAdditionalSpriteStates.idle
                );
            }
        }

        this.allElements.push(this.prizeTableBg, ...this.prizeLevelSprites);

        this.scene.game.events.on(
            'event-update-prize-levels',
            this.updatePrizeLevels,
            this
        );
        this.scene.game.events.on(
            'event-start-prize-win',
            this.animatePrize,
            this
        );
        this.scene.game.events.on(
            'event-stop-prize-win',
            this.stopAnimatePrize,
            this
        );
        this.orientationChange();
    }

    private emitDimensions(): void {
        if (
            !this.config.hasOwnProperty('emitDimensions') ||
            (this.config.hasOwnProperty('emitDimensions') &&
                this.config.emitDimensions == true)
        ) {
            this.scene.game.events.emit(
                'event-update-sidepanel-dimensions',
                this._width,
                this._height
            );
        }
    }

    private animatePrize(count: number, delay = 0, duration = -1): void {
        if (count < this.config.prizeMinRequirement) {
            return;
        }

        setTimeout(() => {
            this.showingTween && this.showingTween.stop();

            this.prizeLevelTexts.forEach((element) => {
                element.forEach((inner) => {
                    inner.setAlpha(1);
                });
            });

            const index =
                this.config.prizeMinRequirement +
                this.config.prizeLevels -
                1 -
                count;
            this.winCurrentIndex = index;

            this.prizeLevelSprites[index].anims.play(`prizeAnim${count}`);
            this.logo && this.logo.anims.play('logoAnimation');
            if (this.logoAdditionalSpriteActive) {
                this.logoAdditionalSpriteSetCurrentState(
                    eLogoAdditionalSpriteStates.anim
                );
            }
            this.repositionAdditionalPrizeTexts(0);
            this.winPulse(this.allPrizeTexts, 1, 1.1, this.logo);
            const additionalTargets = [];
            if (this.config.prizeSpriteCfg.activeOverlay) {
                if (
                    this.config.prizeSpriteCfg.activeOverlay
                        .winActivatesAllSprites
                ) {
                    additionalTargets.push(...this.prizeLevelSpritesActive);
                } else {
                    additionalTargets.push(this.prizeLevelSpritesActive[index]);
                }
            }
            additionalTargets.forEach((element) => {
                element.setActive(true).setVisible(true).setAlpha(0);
            });
            const trgs = [...additionalTargets];
            this.prizeLevelTextCurrent &&
                trgs.push(...this.prizeLevelTextCurrent);
            this.showingTween = this.scene.add.tween({
                targets: trgs,
                duration: 125,
                alpha: 1,
                ease: 'Linear',
                onStart: () => {
                    if (
                        this.config.bitmapTextCfg.layeredDesign &&
                        this.config.bitmapTextCfg.layeredDesign.mainLayers
                            .fadeOutForWin
                    ) {
                        this.scene.add.tween({
                            targets: this.prizeLevelTexts[index],
                            alpha: 0,
                            duration: 125,
                            ease: 'Linear',
                        });
                    }
                },
                onComplete: () => {
                    const trgs = [this.prizeLevelSprites[index]];
                    if (this.prizeLevelSpritesActive) {
                        trgs.push(this.prizeLevelSpritesActive[index]);
                    }
                    this.scene.tweens.add({
                        targets: trgs,
                        duration: 125,
                        scale: this._scale * 1.2,
                        ease: 'Linear',
                    });
                },
            });

            if (duration > -1) {
                this.stopAnimatePrize(duration);
            }
        }, delay);
    }

    private stopAnimatePrize(delay: number): void {
        setTimeout(() => {
            this.logo && this.logo.anims.stop();

            this.prizeLevelSprites.forEach((element) => {
                element.anims.stop();
                // element.setScale(this._scale);
            });
            if (this.winCurrentIndex > -1) {
                this.scene.add.tween({
                    targets: this.prizeLevelSpritesActive,
                    alpha: 0,
                    ease: 'Linear',
                    duration: 250,
                    onComplete: () => {
                        this.prizeLevelSpritesActive &&
                            this.prizeLevelSpritesActive.forEach((element) => {
                                element
                                    .setVisible(false)
                                    .setActive(false)
                                    .setAlpha(1);
                            });
                    },
                });
                if (this.logoAdditionalSprite) {
                    this.logoAdditionalSprite.anims.stop();
                    if (this.config.additionalSpriteCfg.idleAnimation) {
                        this.logoAdditionalSprite.setScale(
                            this._scale /
                                this.config.additionalSpriteCfg.idleAnimation
                                    .scale
                        );
                        this.scene.anims.play(
                            'additionalSpriteIdleAnim',
                            this.logoAdditionalSprite
                        );
                    }
                    this.logoAdditionalSpriteSetCurrentState(
                        eLogoAdditionalSpriteStates.idle
                    );
                }
                this.repositionElements(1);
                this.stopWinPulse();
                this.winCurrentIndex = -1;
                this.idlePulse(this.lastPulseIndex);
            }
        }, delay);
    }

    private winPulse(trgs, from: number, to: number, altTarget?): void {
        this.scaleTween = this.scene.tweens.addCounter({
            from: from,
            to: to,
            duration: 825,
            onUpdate: () => {
                trgs.forEach((element) => {
                    let additionalScale;
                    if (globalGetIsPortrait(this.scene)) {
                        additionalScale = this.config.positionPort
                            ? this.config.positionPort.scaleX
                            : 1;
                    } else {
                        additionalScale = this.config.positionLand
                            ? this.config.positionLand.scaleX
                            : 1;
                    }

                    this.config.bitmapTextCfg &&
                        element.setFontSize(
                            additionalScale *
                                this.config.bitmapTextCfg.size *
                                this.scaleTween.getValue()
                        );
                });
                altTarget &&
                    this.config.logoCfg &&
                    altTarget.setScale(
                        ((this._scale * 1) / this.logoCfg.scale) *
                            this.scaleTween.getValue()
                    );
            },
            onComplete: () => {
                this.winPulse(trgs, to, from, altTarget);
            },
        });
    }

    private stopWinPulse(): void {
        this.scaleTween && this.scaleTween.stop();
        this.showingTween && this.showingTween.stop();

        this.allPrizeTexts.forEach((element) => {
            element.setAlpha(0);
        });
        this.prizeLevelTexts[this.winCurrentIndex].forEach((element) => {
            element.setAlpha(1);
        });
    }

    updatePrizeLevels(newPrizeLevels: number[]): void {
        for (let i = 0; i < newPrizeLevels.length; i++) {
            for (let j = 0; j < this.prizeLevelTexts[i].length; j++) {
                this.prizeLevelTexts[i][j].setText(
                    newPrizeLevels[i].toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                    })
                );
            }
        }
        this.repositionPrizeTexts();
    }

    repositionElements(additionalSpriteAlpha?: number): void {
        const isPort = globalGetIsPortrait(this.scene);

        for (let i = 0; i < this.allElements.length; i++) {
            this.allElements[i].setPosition(this._x, this._y);
        }

        if (isPort) {
            this._width = this.config.size.portrait.width;
            this._height = this.config.size.portrait.width;

            this.config.bmdTexture &&
                this.prizeTableBg.setSize(
                    this.config.bmdTexture.width,
                    this.config.bmdTexture.height
                );
            let x =
                this._x +
                this.prizeTableBg.width / 2 -
                this.config.offsets.overlapOffsetX;
            let y = this._y + this.prizeTableBg.width / 2;
            if (this.config.positionPort) {
                x += this.config.positionPort.xAdditional;
                y += this.config.positionPort.yAdditional;
            }
            if (this.config.bmdTexture) {
                let width = this.config.bmdTexture.width;
                let height = this.config.bmdTexture.height;
                if (this.config.positionPort) {
                    width *= this.config.positionPort.scaleX;
                    height *= this.config.positionPort.scaleY;
                }
                this.prizeTableBg.setSize(width, height);
            }
            this.prizeTableBg.setPosition(x, y);

            let xx = 0;
            let yy = 0;
            if (this.logo) {
                if (this.logoAdditionalSprite) {
                    this.logo.setPosition(
                        this._x -
                            this.logo.width / 2 +
                            this.config.offsets.overlapOffsetX,
                        this.prizeTableBg.y +
                            this.prizeTableBg.height / 2 -
                            this.logo.height / 2 +
                            this.config.logoCfg.offsetY
                    );
                    xx = this.logo.x;
                    yy =
                        this.logo.y -
                        this.logoAdditionalSprite.height / 2 +
                        this.logo.height *
                            this.config.additionalSpriteCfg.offsets.portrait
                                .offsetFactorYRelativeToLogo;
                } else {
                    this.logo.setPosition(
                        this._x -
                            this.logo.width / 2 +
                            this.config.offsets.overlapOffsetX,
                        this._y
                    );
                }
            } else {
                if (this.logoAdditionalSprite) {
                    xx =
                        this._x -
                        this.logoAdditionalSprite.width / 2 -
                        this.config.offsets.overlapOffsetX;
                    yy = this._y + this.logoAdditionalSprite.height / 2;
                }
            }
            xx += this.config.additionalSpriteCfg.offsets.portrait.offsetX;
            yy += this.config.additionalSpriteCfg.offsets.portrait.offsetY;
            if (this.logoAdditionalSprite) {
                this.logoAdditionalSprite.setPosition(xx, yy);
                this.orientationChange();
            }
        } else {
            this._width = this.config.size.landscape.width;
            this._height = this.config.size.landscape.height;

            if (this.config.bmdTexture) {
                let width = this.config.bmdTexture.width;
                let height = this.config.bmdTexture.height;
                if (this.config.positionLand) {
                    width *= this.config.positionLand.scaleX;
                    height *= this.config.positionLand.scaleY;
                }
                this.prizeTableBg.setSize(width, height);
            }
            let x = this._x;
            let y =
                this._y +
                this.prizeTableBg.height / 3 -
                this.config.offsets.overlapOffsetY;
            if (this.config.positionLand) {
                x += this.config.positionLand.xAdditional;
                y += this.config.positionLand.yAdditional;
            }
            this.prizeTableBg.setPosition(x, y);
            this.logo &&
                this.logo.setPosition(
                    this._x,
                    this.prizeTableBg.y -
                        (this.logo.height + this.prizeTableBg.height) / 2 +
                        this.config.offsets.overlapOffsetY +
                        this.config.logoCfg.offsetY
                );

            if (this.logoAdditionalSprite) {
                let yy = this.config.additionalSpriteCfg.offsets.landscape
                    .offsetY;
                const xx =
                    this._x +
                    this.config.additionalSpriteCfg.offsets.landscape.offsetX;
                if (!this.logo) {
                    yy +=
                        this.prizeTableBg.y -
                        (this.logoAdditionalSprite.height +
                            this.prizeTableBg.height) /
                            2 +
                        this.config.offsets.overlapOffsetY;
                } else {
                    yy +=
                        this.logo.y -
                        this.logoAdditionalSprite.height / 2 +
                        this.logo.height *
                            this.config.additionalSpriteCfg.offsets.landscape
                                .offsetFactorYRelativeToLogo;
                }
                this.logoAdditionalSprite &&
                    this.logoAdditionalSprite.setPosition(xx, yy);
            }
        }
        this.emitDimensions();
        this.repositionPrizeTexts();
        this.repositionAdditionalPrizeTexts(additionalSpriteAlpha);
        this.repositionPrizeSprites();
    }

    private repositionPrizeTexts(): void {
        for (let i = 0; i < this.prizeLevelTexts.length; i++) {
            const additionalOffsetH =
                i > 0 && this.config.bitmapTextCfg.additionalOffsetYSecond
                    ? this.config.bitmapTextCfg.additionalOffsetYSecond
                    : 0;

            const offsetH =
                ((this.prizeTableBg.height +
                    this.config.tableBgActualHeightDiff) /
                    this.prizeLevelTexts.length +
                    this.config.bitmapTextCfg.offsetY) *
                    i +
                this.config.bitmapTextCfg.offsetTop +
                additionalOffsetH;

            for (let j = 0; j < this.prizeLevelTexts[i].length; j++) {
                if (globalGetIsPortrait(this.scene)) {
                    this.prizeLevelTexts[i][j].setFontSize(
                        this.config.bitmapTextCfg.size *
                            (this.config.positionPort
                                ? this.config.positionPort.scaleX
                                : 1)
                    );
                } else {
                    this.prizeLevelTexts[i][j].setFontSize(
                        this.config.bitmapTextCfg.size *
                            (this.config.positionLand
                                ? this.config.positionLand.scaleX
                                : 1)
                    );
                }

                this.prizeLevelTexts[i][j].setPosition(
                    this.prizeTableBg.x +
                        this.prizeTableBg.width / 2 +
                        this.config.bitmapTextCfg.offsetX -
                        (this.prizeLevelTexts[i][j].scaleX *
                            this.prizeLevelTexts[i][j].width) /
                            2,
                    this.prizeTableBg.y - this.prizeTableBg.height / 2 + offsetH
                );
                this.prizeLevelTexts[i][j].setOrigin(0.5, 0.5);
            }
        }
    }

    private repositionAdditionalPrizeTexts(alpha?: number): void {
        const index =
            this.winCurrentIndex > -1
                ? this.winCurrentIndex
                : this.lastPulseIndex;
        if (index < 0) {
            return;
        }
        const text = this.prizeLevelTexts[index][0].text;

        this.prizeLevelTextCurrent &&
            this.prizeLevelTextCurrent.forEach((element) => {
                if (globalGetIsPortrait(this.scene)) {
                    element.setFontSize(
                        this.config.bitmapTextCfg.size *
                            (this.config.positionPort
                                ? this.config.positionPort.scaleX
                                : 1)
                    );
                } else {
                    element.setFontSize(
                        this.config.bitmapTextCfg.size *
                            (this.config.positionLand
                                ? this.config.positionLand.scaleX
                                : 1)
                    );
                }
                element.setPosition(
                    this.prizeLevelTexts[index][0].x,
                    this.prizeLevelTexts[index][0].y
                );
                element.setOrigin(
                    this.prizeLevelTexts[index][0].originX,
                    this.prizeLevelTexts[index][0].originY
                );
                element.setActive(true).setVisible(true);
                element.setText(text);
                alpha && element.setAlpha(alpha);
            });

        this.prizeLevelTextAdditional &&
            this.prizeLevelTextAdditional.forEach((element) => {
                if (globalGetIsPortrait(this.scene)) {
                    element.setFontSize(
                        this.config.bitmapTextCfg.size *
                            (this.config.positionPort
                                ? this.config.positionPort.scaleX
                                : 1)
                    );
                } else {
                    element.setFontSize(
                        this.config.bitmapTextCfg.size *
                            (this.config.positionLand
                                ? this.config.positionLand.scaleX
                                : 1)
                    );
                }
                // element.setFontSize(this.prizeLevelTexts[index][0].fontSize);
                element.setPosition(
                    this.prizeLevelTexts[index][0].x,
                    this.prizeLevelTexts[index][0].y
                );
                element.setOrigin(
                    this.prizeLevelTexts[index][0].originX,
                    this.prizeLevelTexts[index][0].originY
                );
                element
                    .setActive(this.winCurrentIndex > -1)
                    .setVisible(this.winCurrentIndex > -1)
                    .setAlpha(1);
                element.setText(text);
            });

        if (!this.config.pulseDuration && this.winCurrentIndex == -1) {
            const trgs = [];
            this.prizeLevelTextCurrent &&
                trgs.push(...this.prizeLevelTextCurrent);
            this.prizeLevelTextAdditional &&
                trgs.push(...this.prizeLevelTextAdditional);
            trgs.forEach((element) => {
                element.setAlpha(0);
            });
        }
    }

    private repositionPrizeSprites(): void {
        const leftX =
            this.prizeTableBg.x -
            this.prizeTableBg.width / 2 +
            this.config.prizeSpriteCfg.offsetLeft;

        const isPort = globalGetIsPortrait(this.scene);

        for (let i = 0; i < this.prizeLevelSprites.length; i++) {
            let additionalOffsetY = 0;
            if (i == 0) {
                additionalOffsetY = this.config.prizeSpriteCfg.offsetTop;
            }
            if (this.config.prizeSpriteCfg.additionalOffsetY) {
                additionalOffsetY += this.config.prizeSpriteCfg
                    .additionalOffsetY[i];
            }
            let newScale = this._scale;
            if (isPort && this.config.positionPort) {
                newScale *=
                    this.config.positionPort.scaleX *
                    this.config.prizeSpriteCfg.scalePortrait;
            } else if (!isPort && this.config.positionLand) {
                newScale *=
                    this.config.positionLand.scaleX *
                    this.config.prizeSpriteCfg.scaleLandscape;
            }
            this.prizeLevelSprites[i].setScale(newScale);

            this.prizeLevelSprites[i].setY(
                this.prizeLevelTexts[i][0].y + additionalOffsetY
            );
            this.prizeLevelSprites[i].setX(
                leftX + i * this.config.prizeSpriteCfg.offsetX
            );
            this.prizeLevelSpritesBase &&
                this.prizeLevelSpritesBase[i] &&
                this.prizeLevelSpritesBase[i].setScale(newScale);
            this.prizeLevelSpritesBase &&
                this.prizeLevelSpritesBase[i] &&
                this.prizeLevelSpritesBase[i].setPosition(
                    this.prizeLevelSprites[i].x +
                        this.config.prizeSpriteCfg.baseOverlay.offsetX,
                    this.prizeLevelSprites[i].y +
                        this.config.prizeSpriteCfg.baseOverlay.offsetY
                );
            this.prizeLevelSpritesActive &&
                this.prizeLevelSpritesActive[i] &&
                this.prizeLevelSpritesActive[i].setScale(newScale);
            this.prizeLevelSpritesActive &&
                this.prizeLevelSpritesActive[i] &&
                this.prizeLevelSpritesActive[i].setPosition(
                    this.prizeLevelSprites[i].x,
                    this.prizeLevelSprites[i].y
                );
        }
    }

    private idlePulse(index: number): void {
        if (!this.config.pulseDuration) {
            return;
        }

        this.showingTween && this.showingTween.stop();

        this.lastPulseIndex = index;
        this.repositionAdditionalPrizeTexts();

        this.prizeLevelTextCurrent &&
            this.prizeLevelTextCurrent.forEach((element) => {
                element.setAlpha(0);
            });

        let next = index - 1;
        if (next < 0) {
            next = this.prizeLevelTexts.length - 1;
        }

        if (this.prizeLevelTextCurrent) {
            this.prizeLevelTextCurrent.forEach((element) => {
                element.setActive(true).setVisible(true).setAlpha(0);
            });
            this.showingTween = this.scene.tweens.addCounter({
                from: 0,
                to: 1,
                duration: this.config.pulseDuration,
                onUpdate: () => {
                    if (this.prizeLevelSpritesActive) {
                        if (
                            !this.prizeLevelSpritesActive[index].active ||
                            !this.prizeLevelSpritesActive[index].visible
                        ) {
                            this.prizeLevelSpritesActive[index]
                                .setActive(true)
                                .setVisible(true);
                        }
                        this.prizeLevelSpritesActive[index].setAlpha(
                            this.showingTween.getValue()
                        );
                    }
                    this.prizeLevelTextCurrent.forEach((element) => {
                        element.setAlpha(this.showingTween.getValue());
                    });

                    this.config.bitmapTextCfg.layeredDesign.mainLayers
                        .fadeOutForIdlePulse &&
                        this.prizeLevelTexts[index].forEach((element) => {
                            element.setAlpha(1 - this.showingTween.getValue());
                        });
                },
                onComplete: () => {
                    this.showingTween = this.scene.tweens.addCounter({
                        from: 1,
                        to: 0,
                        duration: this.config.pulseDuration,
                        onUpdate: () => {
                            this.prizeLevelSpritesActive &&
                                this.prizeLevelSpritesActive[index].setAlpha(
                                    this.showingTween.getValue()
                                );

                            this.prizeLevelTextCurrent.forEach((element) => {
                                element.setAlpha(this.showingTween.getValue());
                            });

                            this.config.bitmapTextCfg.layeredDesign.mainLayers
                                .fadeOutForIdlePulse &&
                                this.prizeLevelTexts[index].forEach(
                                    (element) => {
                                        element.setAlpha(
                                            1 - this.showingTween.getValue()
                                        );
                                    }
                                );
                        },
                        onComplete: () => {
                            this.prizeLevelSpritesActive &&
                                this.prizeLevelSpritesActive[index].setAlpha(0);
                            this.prizeLevelTextCurrent.forEach((element) => {
                                element.setAlpha(0);
                            });
                            this.idlePulse(next);
                        },
                    });
                },
            });
        }
    }

    get allPrizeTexts(): any[] {
        const trgs = [];
        this.prizeLevelTextCurrent && trgs.push(...this.prizeLevelTextCurrent);
        if (this.winCurrentIndex > -1) {
            trgs.push(...this.prizeLevelTexts[this.winCurrentIndex]);
            this.prizeLevelTextAdditional &&
                trgs.push(...this.prizeLevelTextAdditional);
        } else {
            this.prizeLevelTexts.forEach((element) => {
                trgs.push(...element);
            });
        }
        return trgs;
    }

    private _x = 0;
    set x(value: number) {
        this.setX(value);
    }

    get x(): number {
        return this._x;
    }

    private _y = 0;
    set y(value: number) {
        this.setY(value);
    }

    get y(): number {
        return this._y;
    }

    setX(value: number): this {
        this._x = value;
        return this;
    }

    setY(value: number): this {
        this._y = value;
        return this;
    }

    setPosition(x: number, y: number, isPort: boolean): void {
        if (isPort) {
            this._x = x;
            this._y = y + this.config.offsets.reelsOffsetH;
        } else {
            this._x = x + this.config.offsets.reelOffsetW;
            this._y = y;
        }
    }

    private _scale = 1;
    setScale(scale: number): void {
        this._scale = scale;
        this.allElements.forEach((element) => {
            element.setScale(this._scale);
            if (
                this.config.additionalSpriteCfg &&
                element === this.logoAdditionalSprite
            ) {
                element.setScale(
                    this._scale /
                        (globalGetIsPortrait(this.scene)
                            ? this.config.additionalSpriteCfg.scalePortrait
                            : this.config.additionalSpriteCfg.scaleLandscape)
                );
            }
            if (this.logoCfg && element === this.logo) {
                element.setScale(this._scale / this.logoCfg.scale);
            }
        });
    }

    set scale(scale: number) {
        this.setScale(scale);
    }

    get scale(): number {
        return this._scale;
    }

    orientationChange(): void {
        if (this.logoAdditionalSprite) {
            const isPort = globalGetIsPortrait(this.scene);
            const scale = isPort
                ? this.config.additionalSpriteCfg.scalePortrait
                : this.config.additionalSpriteCfg.scaleLandscape;
            switch (this.logoAdditionalSpriteCurrentState) {
                case eLogoAdditionalSpriteStates.idle:
                    if (this.config.additionalSpriteCfg.idleAnimation) {
                        const shouldPortScale =
                            isPort &&
                            this.config.additionalSpriteCfg.idleAnimation
                                .portraitScaleFactor;
                        this.logoAdditionalSprite.setScale(
                            (scale *
                                (shouldPortScale
                                    ? this.config.additionalSpriteCfg
                                          .idleAnimation.portraitScaleFactor
                                    : 1)) /
                                this.config.additionalSpriteCfg.idleAnimation
                                    .scale
                        );
                    } else {
                        this.logoAdditionalSprite.setFrame(
                            this.config.additionalSpriteCfg.textureKey +
                                (isPort ? '-portrait' : '')
                        );
                        this.logoAdditionalSprite.setScale(scale);
                    }
                    break;
                case eLogoAdditionalSpriteStates.postAnim:
                    this.logoAdditionalSprite.setFrame(
                        `${this.config.additionalSpriteCfg.textureKey}_active` +
                            (isPort ? '-portrait' : '')
                    );
                    this.logoAdditionalSprite.setScale(scale);
                    break;
                case eLogoAdditionalSpriteStates.anim: {
                    const shouldPortScale =
                        isPort &&
                        this.config.additionalSpriteCfg.winAnimation
                            .portraitScaleFactor;
                    this.logoAdditionalSprite.setScale(
                        (scale *
                            (shouldPortScale
                                ? this.config.additionalSpriteCfg.winAnimation
                                      .portraitScaleFactor
                                : 1)) /
                            this.config.additionalSpriteCfg.winAnimation.scale
                    );
                    break;
                }
            }
            this.logoAdditionalSpriteActive.setFrame(
                `${this.config.additionalSpriteCfg.textureKey}_active` +
                    (isPort ? '-portrait' : '')
            );
            this.logoAdditionalSpriteActive.setPosition(
                this.logoAdditionalSprite.x,
                this.logoAdditionalSprite.y
            );
            this.logoAdditionalSpriteActive.setScale(scale);
        }
    }

    protected logoAdditionalSpriteSetCurrentState(
        newState: eLogoAdditionalSpriteStates
    ): void {
        const oldState = this.logoAdditionalSpriteCurrentState;
        this.logoAdditionalSpriteCurrentState = newState;
        if (newState == eLogoAdditionalSpriteStates.anim) {
            if (
                this.winCurrentIndex > -1 &&
                this.config.additionalSpriteCfg.winAnimation
            ) {
                this.logoAdditionalSprite.setTexture(
                    this.config.additionalSpriteCfg.winAnimation.textureKey
                );
                this.scene.anims.play(
                    this.winAnimKey,
                    this.logoAdditionalSprite
                );
            } else if (
                this.winCurrentIndex == -1 &&
                this.config.additionalSpriteCfg.idleAnimation
            ) {
                this.logoAdditionalSprite.setTexture(
                    this.config.additionalSpriteCfg.idleAnimation.textureKey
                );
                this.scene.anims.play(
                    'additionalSpriteIdleAnim',
                    this.logoAdditionalSprite
                );
            } else {
                this.logoAdditionalSprite.setTexture(
                    this.config.additionalSpriteCfg.textureKey
                );
            }
        } else {
            if (
                newState == eLogoAdditionalSpriteStates.idle &&
                oldState != newState
            ) {
                this.logoAdditionalSpriteActive
                    .setActive(true)
                    .setVisible(true)
                    .setAlpha(1);
                this.scene.add.tween({
                    targets: this.logoAdditionalSpriteActive,
                    duration: 300,
                    alpha: 0,
                    ease: 'Linear',
                    onComplete: () => {
                        this.logoAdditionalSpriteActive
                            .setActive(false)
                            .setVisible(false)
                            .setAlpha(1);
                    },
                });
            }
            this.logoAdditionalSprite.setTexture(
                this.config.additionalSpriteCfg.textureKey
            );
        }
        this.orientationChange();
    }
}
