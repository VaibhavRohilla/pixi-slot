import { addEnginePreloaderToScene } from '../../addEnginePreloaderToScene';
import BackgroundBasis from './BackgroundBasis';

export default class LoadingIntroScene extends BackgroundBasis {
    introSprite: Phaser.GameObjects.Sprite = null;
    introSpriteAnimationCreated: boolean;
    clientframeworkStudios: Phaser.GameObjects.Sprite = null;
    progressBar: Phaser.GameObjects.Text = null;
    private progressValue = 0;
    loadedKeys: any = {};

    constructor() {
        super(
            {
                key: 'LoadingIntroScene',
            },
            'preload-bg',
            require('ASSETS_DIR/images/preload-bg.png'),
            require('ASSETS_DIR/images/preload-bg-portrait.png')
        );
    }

    preload(): void {
        addEnginePreloaderToScene(this);

        //this.load.on("filecomplete", this.fileLoaded, this);
        this.game.events.on(
            'event-preload-progress',
            this.preloadProgress,
            this
        );
        this.game.events.on(
            'event-preload-complete',
            this.preloadCompleted,
            this
        );

        this.load.image(
            'logo0',
            require('ASSETS_DIR_COMMON/clientframework_logo0000.png')
        );
        this.load.image(
            'clientframeworkStudios',
            require('ASSETS_DIR_COMMON/clientframework_studios.png')
        );

        ////////////////////////
        {
            //if (navigator.userAgent.includes('iPhone')) {
            //this.load.multiatlas("splashIntro", require("ASSETS_DIR_COMMON/GIsmall.json"), "ASSETS_DIR_COMMON");
            this.load.atlas(
                'splashIntro',
                require('ASSETS_DIR_COMMON/clientframeworkIntro.png'),
                require('ASSETS_DIR_COMMON/clientframeworkIntro.json')
            );
            //scene.load.audio("introSound", "assets/clientframework logo render.mp3");
        }
        super.preloadBackgroundAssets();
    }

    createSpecific(): void {
        this.loadingIntroLoaded();
    }

    loadingIntroLoaded(): void {
        this.game.events.emit('event-loading-intro-loaded');
        this.makeAnimatedIntro();
    }

    preloadCompleted(): void {
        //hook
    }

    preloadProgress(value): void {
        console.log('on progress', value);
        if (this.progressBar) {
            this.progressBar.setOrigin(0.5);

            this.progressBar.setText(this.getProgressBarStringFormat(value));
        }
        this.progressValue = value;
    }

    private getProgressBarStringFormat(value: number): string {
        return Math.floor(value * 100).toString() + ' %';
    }

    ////////////////
    // visual part

    makeStaticIntro(): void {
        console.log('AAAAAAAAAAAAA');
        const xx = 0; //Number(this.game.config.width) / 2;
        const yy = 0; //Number(this.game.config.height) / 2;
        this.introSprite = this.add.sprite(xx, yy - 150, 'logo0');

        this.makeLogoText();

        this.makeProgressBar();

        if (navigator.userAgent.includes('Mobile')) {
            this.input.on(
                'pointerdown',
                () => {
                    //delcons console.log("full scrb")
                    if (!this.scale.isFullscreen) {
                        this.scale.startFullscreen();
                    }
                },
                this
            );
        }

        if (navigator.userAgent.includes('Mobile')) {
            this.cameras.main.zoom = 0.85;
            window.scrollTo(0, 40);
        } else {
            window.scrollTo(0, 0);
        }
    }

    makeLogoText(): void {
        if (!this.clientframeworkStudios) {
            const xx = 0; //Number(this.game.config.width) / 2;
            const yy = 0; //Number(this.game.config.height) / 2;
            this.clientframeworkStudios = this.add.sprite(
                xx,
                yy + 250,
                'clientframeworkStudios'
            );
        }
    }

    makeProgressBar(): void {
        if (!this.progressBar) {
            const xx = 0; //Number(this.game.config.width) / 2;
            const yy2 = 0.4 * this.originalSize.height; //0.9 * Number(this.game.config.height);
            this.progressBar = this.add.text(
                xx,
                yy2,
                this.getProgressBarStringFormat(this.progressValue),
                { font: 'bold 100px Fortuna', align: 'center' }
            );
            this.progressBar.setOrigin(0.5);
            this.progressBar.setDepth(1);
        } else {
            console.log('set depth');
            this.progressBar.setDepth(1);
        }
    }

    makeAnimatedIntro(): void {
        this.makeLogoText();
        this.makeProgressBar();

        const xx = 0; //Number(this.game.config.width) / 2;
        const yy = 0; //Number(this.game.config.height) / 2;

        if (this.introSprite) {
            this.introSprite.destroy();
        }
        this.introSprite = this.add.sprite(xx, yy - 150, 'splashIntro');

        //const frameNames = this.anims.generateFrameNames('splashIntro', { start: 0, end: 46, zeroPad: 4, prefix: 'clientframework_logo', suffix: '' });
        //delcons console.log("frameNames", frameNames);
        //const introAnim = this.anims.create({ key: 'introAnim', frames: frameNames, frameRate: 30, repeat: -1 });
        this.introSprite.on(
            'animationcomplete',
            () => {
                if (this.introSprite) {
                    this.tweens.add({
                        targets: [this.introSprite, this.clientframeworkStudios],
                        duration: 500,
                        alpha: '1',
                        ease: 'Linear',
                        onComplete: () => {
                            this.destroyIntro();
                            // if (this.introSound) {
                            //     this.introSound.stop();
                            // }
                        },
                    });
                    this.createBackgroundSprite();
                    this.bgImage.setActive(true).setVisible(true);
                    this.bgImage.alpha = 0;
                    this.tweens.add({
                        targets: [this.bgImage],
                        duration: 500,
                        alpha: '1',
                        ease: 'Linear',
                        onComplete: () => {
                            //hook
                        },
                    });
                }
            },
            this
        );
        this.introSprite.on(
            'animationrepeat',
            () => {
                if (this.progressValue >= 0.4) {
                    this.introSprite.anims.stop();
                }
            },
            this
        );
        this.introSprite.anims.play('introAnim');
        this.introSprite.setScale(1.7, 1.7);
    }

    destroyIntro(): void {
        if (this.introSprite) {
            this.introSprite.destroy();
        }
        this.introSprite = null;
        if (this.clientframeworkStudios) {
            this.clientframeworkStudios.destroy();
        }
        this.clientframeworkStudios = null;
    }

    // fileLoaded(key, type, texture) {
    //     console.log("loaded file", key, type, texture);

    //     this.loadedKeys[key] = true;

    //     console.log("this.loadedKeys", this.loadedKeys);

    //     if (
    //         this.loadedKeys.hasOwnProperty("logo0")
    //         && this.loadedKeys.hasOwnProperty("clientframeworkStudios")
    //         && this.introSprite === null
    //     ) {
    //         console.log("loaded clientframeworkstudios if")
    //         this.makeStaticIntro();
    //     }
    //     else if (
    //         this.loadedKeys.hasOwnProperty("splashIntro")
    //         && this.loadedKeys.hasOwnProperty(this.bgImageKey)
    //         && this.loadedKeys.hasOwnProperty(this.bgImageKeyPortrait)
    //         && !this.introSpriteAnimationCreated
    //     ) {
    //         this.introSpriteAnimationCreated = true;

    //         console.log("loaded loading screen if")
    //         this.loadingIntroLoaded();
    //         //this.scene.launch('LoadingCompleteScene');
    //     }
    // }
}
