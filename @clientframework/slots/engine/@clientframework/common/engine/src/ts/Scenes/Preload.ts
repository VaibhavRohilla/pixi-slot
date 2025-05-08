import * as NProgress from 'nprogress';
import _forEach from 'lodash-es/forEach';
import _sortBy from 'lodash-es/sortBy';
import _find from 'lodash-es/find';
import ComponentLayer from './ComponentLayer';
import Game from '../Game';
import {
    createPressToStartAnimation,
    resizePressToStartAnimation,
} from '../GameObjects/pressToStart';
import {
    onEventEmitterSet,
    getEventEmitter,
} from '@backendService/eventEmitter';
import { animatedLogoCfg, PRELOAD_ANIMATE_GAME_LOGO } from '@specific/config';
import { globalGetIsPortrait } from '../globalGetIsPortrait';
import {
    getAnimateBacklightInsteadOfLogo,
    getLoadingBarYRatio,
    preloadHasFadeInShadow,
} from '@clientframework/slots/engine/src/ts/dataPresenter/defaultConfigSlot';
import { PreBootLogo } from '../GameObjects/preBootLogo';

export default class Preload extends ComponentLayer {
    loadingBarMask: Phaser.GameObjects.Graphics;
    loadingBarOffset = 0;
    presstoStartOffsetY = 0;
    presstoStartOffsetScale = 0;
    pressToStartFontSize: {
        mobilePort: number;
        mobileLand: number;
        desktopPort: number;
        desktopLand: number;
        stroke?: string;
        strokeThickness?: number;
    } = null;

    introSprite: Phaser.GameObjects.Sprite;
    introImage: Phaser.GameObjects.Image;
    backlight: Phaser.GameObjects.Sprite;
    blackShadow: Phaser.GameObjects.Image;
    bottomShadow: Phaser.GameObjects.Image;

    progress = 0;

    preloadComplete = false;
    static clientConnected = false;

    protected turnOffLoadingBarWhenFinished = false;

    preBootLogo: PreBootLogo;

    constructor() {
        super({
            key: 'Preload',
        });
    }

    initSpecificPre(): void {
        //hook
    }

    init(data: object): void {
        super.init(data);

        console.log('Preload init');
        this.initSpecificPre();

        this.preBootLogo = new PreBootLogo(this);

        if (preloadHasFadeInShadow) {
            this.bottomShadow = this.add
                .image(0, 0, 'BottomShade')
                .setOrigin(0, 0)
                .setAlpha(0);
        }

        if (PRELOAD_ANIMATE_GAME_LOGO) {
            if (getAnimateBacklightInsteadOfLogo()) {
                this.backlight = this.add.sprite(0, 0, 'backLight');
                this.backlight.setScale(1.5 / 0.56);
                let animFrames = this.anims.generateFrameNames('backLight');
                animFrames = _sortBy(animFrames, ['frame']);
                this.anims.create({
                    key: 'backlightAnim',
                    frames: animFrames,
                    repeat: -1,
                    frameRate: animatedLogoCfg.frameRate,
                });

                this.backlight.on('animationcomplete', () => {
                    this.backlight.setFrame('anim_00');
                });
                this.backlight.setActive(true).setVisible(true).setAlpha(0);
                this.backlight.anims.play('backlightAnim');
                this.add.tween({
                    targets: this.backlight,
                    duration: 250,
                    alpha: 1,
                    ease: 'Linear',
                });

                this.introImage = this.add.image(0, 0, 'logo-preload');
                this.introImage.setScale(1.5);
            } else {
                this.introSprite = this.add.sprite(0, 0, 'logoAnim', 'anim_00');
                this.introSprite.setScale(1.5 * (1 / animatedLogoCfg.scale));

                let animFrames = this.anims.generateFrameNames('logoAnim');
                animFrames = _sortBy(animFrames, ['frame']);
                this.anims.create({
                    key: 'logoAnimation',
                    frames: animFrames,
                    repeat: -1,
                    frameRate: animatedLogoCfg.frameRate,
                });

                this.introSprite.on('animationcomplete', () => {
                    this.introSprite.setFrame('anim_00');
                });
                this.introSprite.setActive(true).setVisible(true).setAlpha(0);
                //this.cameras.main.setBackgroundColor('#000000');
                this.introSprite.anims.play('logoAnimation');

                this.add.tween({
                    targets: this.introSprite,
                    duration: 250,
                    alpha: 1,
                    ease: 'Linear',
                });
            }
        }
        this.initSpecificPost();

        this.loadingBarMask = this.make.graphics({});
        this.preBootLogo.loadingBarOn.mask =
            new Phaser.Display.Masks.GeometryMask(this, this.loadingBarMask);

        this.resize();

        this.game.events.once(
            'event-preload-complete',
            () => {
                this.preloadComplete = true;
                this.allowStartIfPossible(this);
            },
            this
        );

        this.game.events.once(
            'event-init-msg-handled',
            () => {
                this.game.events.emit('event-client-connected-preload');
                Preload.clientConnected = true;
                this.allowStartIfPossible(this);
            },
            this
        );

        this.game.events.once(
            'event-loading-complete-scene-clicked',
            this.loadingCompletedSceneClicked,
            this
        );
    }

    initSpecificPost(): void {}

    loadingCompletedSceneClicked(): void {
        if (PRELOAD_ANIMATE_GAME_LOGO) {
            const trgs = [];
            this.introImage && trgs.push(this.introImage);
            this.introSprite && trgs.push(this.introSprite);
            this.backlight && trgs.push(this.backlight);
            this.tweens.add({
                targets: trgs,
                duration: 1000,
                alpha: 0,
                ease: 'Linear',
                onComplete: () => {
                    this.startGame();
                },
            });
        } else {
            this.startGame();
        }
    }

    allowStartIfPossible(scene: Phaser.Scene): void {
        scene;
        console.log('allow start');
        if (this.preloadComplete && Preload.clientConnected) {
            // if (this.turnOffLoadingBarWhenFinished) {
            //     this.preBootLogo.loadingBarOff
            //         .setActive(false)
            //         .setVisible(false);
            //     this.preBootLogo.loadingBarOn
            //         .setActive(false)
            //         .setVisible(false);
            // }
            if (preloadHasFadeInShadow) {
                this.fadeInShade();
            }

            createPressToStartAnimation(this);
            this.resize();
        }
    }

    startGame(): void {
        this.game.events.emit('preload-complete');

        this.startScenes();

        const gameSpecificCreate = (this.game as Game).gameSpecificCreate;
        gameSpecificCreate(this);
    }

    protected startScenes(): void {
        _forEach(this.scene.manager.scenes, (scene: Phaser.Scene) => {
            const key = scene.scene.key;

            if (
                scene instanceof ComponentLayer &&
                key != 'Boot' &&
                !this.scene.manager.isActive(key)
            ) {
                this.scene.start(key);
            }
        });
    }

    preload(): void {
        console.log('Preload preload');

        const timer = this.time.addEvent({
            delay: NProgress.settings.trickleSpeed,
            loop: true,
            callback: this.animate,
            callbackScope: this,
        });

        this.load.on('progress', (value: number) => {
            NProgress.set(value);
        });

        this.load.on('complete', () => {
            console.log('Preload preload complete');

            NProgress.done();

            timer.remove();
            // this.scene.sleep('PreBoot');

            this.animate(() => {
                this.time.delayedCall(
                    NProgress.settings.speed,
                    () => {
                        this.game.events.emit('event-preload-complete');
                    },
                    null,
                    this
                );
            });
        });

        const preloadConfig = (this.game as Game).preloadConfig.preload;

        // Multiatlases

        _forEach(preloadConfig.multiatlas, (m) => {
            m &&
                this.load.json(
                    `${m.key}-temp`,
                    m.atlasURL,
                    null,
                    m.atlasXhrSettings
                );
        });

        this.load.on('filecomplete', (key: string, type: string, data: any) => {
            if (type === 'json' && key.includes('-temp')) {
                const multiatlasConfig = _find(preloadConfig.multiatlas, [
                    'key',
                    key.replace('-temp', ''),
                ]);

                if (!multiatlasConfig) {
                    return;
                }

                this.cache.json.remove(key);

                _forEach(data.textures, (texture: any) => {
                    texture.image = (<any>multiatlasConfig).path(
                        `./${texture.image}`
                    );
                });

                this.load.multiatlas(multiatlasConfig.key, data);
                this.load.start();
            }
        });

        // Images

        _forEach(preloadConfig.image, (i) => {
            this.load.image(i.key, i.url, i.xhrSettings);
        });

        // Atlases

        _forEach(preloadConfig.atlas, (a) => {
            this.load.atlas(
                a.key,
                a.textureURL,
                a.atlasURL,
                a.textureXhrSettings,
                a.atlasXhrSettings
            );
        });

        // BitMapFont

        _forEach(preloadConfig.bitmapFont, (a) => {
            this.load.bitmapFont(
                a.key,
                a.textureURL,
                a.atlasURL,
                a.textureXhrSettings,
                a.atlasXhrSettings
            );
        });

        // Audio
        _forEach(preloadConfig.audio, (a) => {
            this.load.audio(a.key, a.url);
        });

        this.animate();
    }

    animate(onComplete?: Function): void {
        this.render();

        const tween = this.tweens.add({
            targets: this,
            progress: {
                from: this.progress,
                to: NProgress.status || 1,
            },
            ease: 'Linear',
            duration: NProgress.settings.speed,
        });

        tween.on('update', this.render, this);

        if (onComplete) {
            tween.on('complete', onComplete);
        }
    }

    render(): void {
        this.loadingBarMask.clear();

        this.loadingBarMask.fillRect(
            this.preBootLogo.loadingBarOn.x -
                this.preBootLogo.loadingBarOn.displayWidth / 2,
            this.preBootLogo.loadingBarOn.y -
                this.preBootLogo.loadingBarOn.displayHeight / 2,
            this.preBootLogo.loadingBarOn.displayWidth * this.progress,
            this.preBootLogo.loadingBarOn.displayHeight
        );
    }

    resize(gameSize: Phaser.Structs.Size = this.scale.gameSize): void {
        this.preBootLogo.resize(gameSize);

        if (preloadHasFadeInShadow) {
            this.bottomShadow.displayWidth = gameSize.width * 1.01;
            this.bottomShadow.displayHeight = gameSize.height;
            this.presstoStartOffsetY = gameSize.height * 0.35;
        }

        if (this.introSprite) {
            this.introSprite.x = gameSize.width / 2;
            this.introSprite.y = gameSize.height / 2;
        }
        if (this.introImage) {
            this.introImage.x = gameSize.width / 2;
            this.introImage.y = gameSize.height / 2;
            this.introImage.setScale(1.5);
            if (navigator.userAgent.includes('iPhone')) {
                this.introImage.setScale(
                    globalGetIsPortrait(this) ? 0.3 : 0.15
                );
            }
        }
        if (this.backlight) {
            this.backlight.x = gameSize.width / 2;
            this.backlight.y = gameSize.height / 2;
            this.backlight.setScale(3 / 0.56);
            if (navigator.userAgent.includes('iPhone')) {
                this.backlight.setScale(
                    this.backlight.scale * (globalGetIsPortrait(this) ? 1 : 0.5)
                );
            }
        }

        if (!globalGetIsPortrait(this)) {
            this.positionLoadingBar(
                gameSize,
                getLoadingBarYRatio(globalGetIsPortrait(this)),
                1 / 3
            );
        } else {
            this.positionLoadingBar(
                gameSize,
                getLoadingBarYRatio(globalGetIsPortrait(this)),
                0.7
            );
        }
    }

    positionLoadingBar(
        gameSize: Phaser.Structs.Size,
        yRatio: number,
        scaleRatio: number
    ): void {
        this.preBootLogo.loadingBarOff.x = this.preBootLogo.loadingBarOn.x =
            gameSize.width / 2;

        this.preBootLogo.loadingBarOff.y = this.preBootLogo.loadingBarOn.y =
            gameSize.height * yRatio;

        this.preBootLogo.loadingBarOff.y += this.loadingBarOffset;
        this.preBootLogo.loadingBarOn.y += this.loadingBarOffset;

        this.preBootLogo.loadingBarOff.setScale(
            (gameSize.width * scaleRatio) / this.preBootLogo.loadingBarOff.width
        );
        this.preBootLogo.loadingBarOn.setScale(
            (gameSize.width * scaleRatio) / this.preBootLogo.loadingBarOn.width
        );
        resizePressToStartAnimation(
            this,
            this.preBootLogo.loadingBarOn.scale * scaleRatio,
            this.presstoStartOffsetY,
            this.presstoStartOffsetScale,
            this.pressToStartFontSize
        );

        this.render();
    }

    fadeInShade(): void {
        this.tweens.add({
            targets: this.bottomShadow,
            duration: 400,
            ease: 'Linear',
            alpha: 1,
        });
    }
}

onEventEmitterSet(() => {
    getEventEmitter().once('event-init-msg-handled', () => {
        Preload.clientConnected = true;
    });
}, this);
