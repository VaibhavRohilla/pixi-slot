import ComponentLayer from './ComponentLayer';
import { BG_IMAGE_SCALE } from '@specific/config';
import { globalGetIsPortrait } from '../globalGetIsPortrait';
import { getReelsSensitiveBackground } from '../defaultConfig';

export default class Background extends ComponentLayer {
    bgImage: Phaser.GameObjects.Image;
    bgImageScaleFactor = BG_IMAGE_SCALE;

    // TODO move bg to css
    private isInPreload = true;
    private sameBgForMainAndPreload = true;

    reelsSensitiveResizeConfig = {
        scaleFactor: 1,
        scaleFactorFreeSpins: 1,
        xOffset: 0,
        yOffset: 0,
        origin: {
            x: 0.5,
            y: 0,
        },
        camera: {
            zoomFactor: 1,
            originOffset: {
                x: 0,
                y: 0,
            },
            scrollOffset: {
                x: 0,
                y: 0,
            },
        },
    };

    constructor(
        protected sceneKey = 'Background',
        protected reelsSensitive = getReelsSensitiveBackground()
    ) {
        super({
            key: sceneKey,
        });
    }

    init(data: object, skipParentSpecificInit = false): void {
        super.init(data);

        if (!skipParentSpecificInit) {
            console.log('Background init');

            this.game.events.once(
                'preload-complete',
                this.preloadComplete,
                this
            );

            this.bgImage = this.add.image(0, 0, 'preload-bg');

            this.game.events.emit(
                'event-background-init',
                this.preloadComplete,
                this
            );
        }

        if (this.reelsSensitive) {
            this.game.events.on(
                'event-reels-scene-coords-data',
                this.resizeByReels,
                this
            );
        }
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.orientationChange();
            }, 50);
        });
        this.orientationChange();
    }

    preloadComplete(): void {
        if (this.textures.exists('bg')) {
            this.sameBgForMainAndPreload = false;
            this.bgImage.setTexture('bg');
        }

        this.isInPreload = false;

        if (!this.sameBgForMainAndPreload) {
            this.textures.remove('preload-bg');
            this.textures.remove('preload-bg-portrait');
        }


        this.orientationChange();
    }

    orientationChange(): void {
        console.log(this.sceneKey + ' orientationChange');

        if (
            ((this.sameBgForMainAndPreload || this.isInPreload) &&
                this.textures.exists('preload-bg-portrait')) ||
            (!this.isInPreload && this.textures.exists('bg-portrait'))
        ) {
            if (
                globalGetIsPortrait(this) &&
                !this.bgImage.texture.key.includes('-portrait')
            ) {
                this.bgImage.setTexture(this.bgImage.texture.key + '-portrait');
            } else if (
                !globalGetIsPortrait(this) &&
                this.bgImage.texture.key.includes('-portrait')
            ) {
                this.bgImage.setTexture(
                    this.bgImage.texture.key.replace('-portrait', '')
                );
            }
        }

        this.resize();
    }

    resize(gameSize = this.scale.gameSize): void {
        console.log(this.sceneKey + ' resize');

        let scale = 1;

        const bgRatio = this.bgImage.width / this.bgImage.height;

        if (bgRatio > gameSize.aspectRatio) {
            scale =
                gameSize.height /
                (this.bgImage.height * this.bgImageScaleFactor);
        } else {
            scale =
                gameSize.width / (this.bgImage.width * this.bgImageScaleFactor);
        }

        this.bgImage.setScale(scale * this.bgImageScaleFactor);

        this.bgImage.x = gameSize.width / 2;
        this.bgImage.y = gameSize.height / 2;

    }

    resizeByReels(data: any): void {
        this.bgImage.setOrigin(
            this.reelsSensitiveResizeConfig.origin.x,
            this.reelsSensitiveResizeConfig.origin.y
        );

        const scale =
            data.bg.scale *
            this.bgImageScaleFactor *
            this.reelsSensitiveResizeConfig.scaleFactor;

        this.bgImage.setScale(scale);
        this.bgImage.setPosition(
            data.bg.x + scale * this.reelsSensitiveResizeConfig.xOffset,
            data.bg.y + scale * this.reelsSensitiveResizeConfig.yOffset
        );
        this.cameras.main.setZoom(
            data.camera.zoom * this.reelsSensitiveResizeConfig.camera.zoomFactor
        );
        this.cameras.main.setOrigin(
            data.camera.originX +
                this.reelsSensitiveResizeConfig.camera.originOffset.x,
            data.camera.originY +
                this.reelsSensitiveResizeConfig.camera.originOffset.y
        );
        this.cameras.main.setScroll(
            data.camera.scrollX +
                this.reelsSensitiveResizeConfig.camera.scrollOffset.x,
            data.camera.scrollY +
                this.reelsSensitiveResizeConfig.camera.scrollOffset.y
        );
    }
}
