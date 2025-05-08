import { globalGetIsPortrait, setScene } from '../globalGetIsPortrait';

export default class DeviceManager extends Phaser.Scene {
    originalSize = new Phaser.Structs.Size(1920, 1080);
    isIPhoneFullScreen = false;


    constructor() {
        super({
            key: 'DeviceManager',
            active: true,
        });
        setScene(this)
    }

    init(): void {


        this.handleOrientation();

        this.handleFullScreen();
        this.setOrientation(
            globalGetIsPortrait() ? 'landscape' : 'portrait'
        );
    }

    setOrientation(orientation: string): void {
        // Preventing ambiguous orientation values
        if (orientation.includes('portrait')) {
            this.scale.orientation = Phaser.Scale.Orientation.PORTRAIT;
        } else if (orientation.includes('landscape')) {
            this.scale.orientation = Phaser.Scale.Orientation.LANDSCAPE;
        }

        // temporary fix for pixelisation issue. old system only left on iphone
        //if (!navigator.userAgent.includes('iPhone')) {
        this.setResize();
        //}
    }

    // temporary fix for pixelisation issue. old system only left on iphone
    // kludge for avoiding infinite function call
    resized = false;
    setResize(): void {
        if (this.resized) {
            this.resized = false;
            return;
        }
        this.resized = true;

        let aspectRatio =
            document.documentElement.clientWidth /
            document.documentElement.clientHeight;
        if (navigator.userAgent.includes('iPhone')) {
            aspectRatio =
                document.documentElement.clientWidth / window.innerHeight;
        }
        let newW = 0;
        let newH = 0;
        if (globalGetIsPortrait()) {
            newW = this.originalSize.height;
            newH = this.originalSize.width;
            aspectRatio = this.originalSize.height / this.originalSize.width
        } else {
            newW = this.originalSize.width;
            newH = this.originalSize.height;
            aspectRatio = this.originalSize.width / this.originalSize.height
        }

        // still persistent phaser's bug for setting of correct new gameSize
        // https://github.com/photonstorm/phaser/issues/4482
        this.game.scale.displaySize.setAspectRatio(aspectRatio);
        this.game.scale.setGameSize(newW, newH);
    }

    handleOrientation(): void {
        // this.scale.on(
        //     Phaser.Scale.Events.ORIENTATION_CHANGE,
        //     this.setOrientation,
        //     this
        // );
        // temporary fix for pixelisation issue. old system only left on iphone
        //if (!navigator.userAgent.includes('iPhone')) {
        this.scale.on(Phaser.Scale.Events.RESIZE, () => {
            this.setOrientation(
                globalGetIsPortrait() ? 'landscape' : 'portrait'
            );
        }, this);


        //}
    }

    private handleFullScreen(): void {
        if (
            !this.game.device.os.desktop
        ) {
            this.input.on('pointerup', () => {
                //this.checkFullscreenIphone();
                if (!this.scale.isFullscreen) {
                    this.scale.startFullscreen();
                }
            });
        }
    }


    // update(): void {
    //     if (navigator.userAgent.includes('iPhone')) {
    //         this.checkFullscreenIphone();
    //     }
    // }

    vw;

    private checkFullscreenIphone(): void {
        if (navigator.userAgent.includes('iPhone')) {

            if (!this.vw) {
                this.vw = document.createElement('div');

                this.vw.style.position = 'fixed';
                this.vw.style.height = '100vh';
                this.vw.style.width = 0;
                this.vw.style.top = 0;

                document.documentElement.appendChild(this.vw);
            }

            this.isIPhoneFullScreen = false;

            if (this.vw) {
                const isFullScrCond =
                    Math.abs(window.innerHeight - this.vw.offsetHeight) < 10;

                // || this.myGame.htmlPages.currentPage != PageTypes.none && tGame.getInstance().getPortraitOrientationFlag()) {
                window.scrollTo(0, 0);

                document.body.style.paddingBottom = '100000px';
                document.body.style.paddingTop = '0px';

                // if(this.blackScreenSprite.alive) {
                //     this.blackScreenSprite.kill();
                // }
                if (isFullScrCond) {
                    this.isIPhoneFullScreen = true;
                }

            }
        }
    }
}
