import ComponentLayer from '../ComponentLayer';
import { globalGetIsPortrait } from '../../globalGetIsPortrait';

// create and init of derived classes must be called with super.init and super.preload
export default abstract class BackgroundBasis extends ComponentLayer {
    originalSize = new Phaser.Structs.Size(1920, 1080);
    scaleMobile = 0.85;
    scaleDesktopLandscape = 0.6;
    scaleDesktopPortrait = 0.85;

    protected bgImage: Phaser.GameObjects.Image;
    protected bgImageKeyPortrait;
    // TODO move bg to css

    constructor(
        data: object,
        protected bgImageKey: string = '',
        protected bgImageUrl: string = '',
        protected bgImageUrlPortrait: string = '',
        protected coverZoom = false
    ) {
        super(data);
        this.bgImageKeyPortrait = this.bgImageKey + '-portrait';
    }

    protected preloadBackgroundAssets(): void {
        if (this.bgImageKey != '' && this.bgImageUrl != '') {
            this.load.image(this.bgImageKey, this.bgImageUrl);
        }
        if (this.bgImageKey != '' && this.bgImageUrlPortrait != '') {
            this.load.image(
                this.bgImageKey + '-portrait',
                this.bgImageUrlPortrait
            );
        }
    }

    protected createBackgroundSprite(): void {
        this.bgImage = this.add.image(0, 0, this.bgImageKey);

        this.orientationResizeRefresh();
    }

    /*private*/ create(): void {
        this.cameras.main.setOrigin(0.5, 0.5);
        this.orientationResizeRefresh();

        this.createSpecific();

        this.orientationResizeRefresh();
    }

    //hook method
    protected createSpecific(): void {
        //hook
    }

    /*private*/ init(data: object): void {
        super.init(data);
        this.initSpecific();
    }

    //hook method
    initSpecific(): void {
        //hook
    }

    private orientationResizeRefresh(): void {
        this.orientationChange();
        this.resizeIntern();
    }

    orientationChange(): void {
        if (!this.scene.manager.isActive(this.scene.key)) {
            return;
        }
        //console.log('BackgroundBasis orientationChange');

        if (this.bgImage) {
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

        this.resizeIntern();
    }

    protected resizeIntern(gameSize = this.scale.gameSize): void {
        let zoom = 1;

        const isDesktop = !navigator.userAgent.includes('Mobile');
        const isIPhone = navigator.userAgent.includes('iPhone');

        const aspectRatio =
            document.documentElement.clientWidth /
            document.documentElement.clientHeight;
        let isPort = globalGetIsPortrait(this);
        // if its desktop
        if (isDesktop) {
            isPort = aspectRatio <= 1;
        }

        let trueWidth = document.documentElement.clientWidth;
        let trueHeight = document.documentElement.clientHeight;
        if (!isIPhone && !(isPort && isDesktop)) {
            if (isPort) {
                trueWidth = this.originalSize.height;
                trueHeight = trueWidth / aspectRatio;
            } else {
                trueHeight = this.originalSize.height;
                trueWidth = trueHeight * aspectRatio;
            }
        }

        if (!this.coverZoom) {
            if (!isPort) {
                zoom = Math.min(
                    trueWidth / this.originalSize.width,
                    trueHeight / this.originalSize.height
                );
            } else {
                zoom = Math.min(
                    trueWidth / this.originalSize.height,
                    trueHeight / this.originalSize.width
                );
            }
        } else {
            if (!isPort) {
                zoom = Math.max(
                    trueWidth / this.originalSize.width,
                    trueHeight / this.originalSize.height
                );
            } else {
                zoom = Math.max(
                    trueWidth / this.originalSize.height,
                    trueHeight / this.originalSize.width
                );
            }
        }

        if (isDesktop) {
            zoom *= isPort
                ? this.scaleDesktopPortrait
                : this.scaleDesktopLandscape;
        } else {
            zoom *= this.scaleMobile;
        }

        this.cameras.main.setZoom(zoom);
        this.cameras.main.scrollX = -gameSize.width / 2;
        this.cameras.main.scrollY = -gameSize.height / 2;
    }

    resize(gameSize = this.scale.gameSize): void {
        if (!this.scene.manager.isActive(this.scene.key)) {
            return;
        }

        this.resizeIntern(gameSize);
    }
}
